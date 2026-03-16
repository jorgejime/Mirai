"""
FastAPI backend for Mirai breast cancer risk prediction.
Receives DICOM files, runs mirai-predict, and returns real predictions.
"""
import json
import logging
import subprocess
import sys
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Mirai API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve the dist directory (frontend build output)
DIST_DIR = Path(__file__).resolve().parent.parent / "dist"


@app.get("/api/mirai/health")
def health():
    return {"status": "ok", "modelVersion": "0.14.1"}


@app.post("/api/mirai/predict")
async def predict(files: list[UploadFile] = File(...)):
    if len(files) != 4:
        raise HTTPException(
            status_code=400,
            detail=f"Se requieren exactamente 4 archivos DICOM. Se recibieron {len(files)}.",
        )

    with tempfile.TemporaryDirectory() as tmpdir:
        dicom_paths = []
        for upload in files:
            dest = Path(tmpdir) / upload.filename
            content = await upload.read()
            dest.write_bytes(content)
            dicom_paths.append(str(dest))

        output_path = Path(tmpdir) / "prediction.json"

        cmd = [
            sys.executable, "-m", "onconet.predict",
            "--use-pydicom",
            "--output-path", str(output_path),
            *dicom_paths,
        ]

        logger.info("Running Mirai: %s", " ".join(cmd))

        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300,
            )
        except subprocess.TimeoutExpired:
            raise HTTPException(status_code=504, detail="El modelo tardó demasiado.")

        if result.returncode != 0:
            logger.error("mirai-predict stderr: %s", result.stderr)
            raise HTTPException(
                status_code=500,
                detail=f"Error ejecutando Mirai: {result.stderr[-500:]}",
            )

        prediction = json.loads(output_path.read_text())
        logger.info("Prediction: %s", prediction)
        return prediction


# Serve frontend static assets
if DIST_DIR.is_dir():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve frontend files; fall back to index.html for SPA routing."""
        file_path = DIST_DIR / full_path
        if full_path and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(DIST_DIR / "index.html")
