import { DicomFile, MiraiResult } from '../types/mirai';

export class MiraiService {
  private static instance: MiraiService;

  private constructor() {}

  public static getInstance(): MiraiService {
    if (!MiraiService.instance) {
      MiraiService.instance = new MiraiService();
    }
    return MiraiService.instance;
  }

  async processDicomFiles(files: DicomFile[]): Promise<MiraiResult> {
    // Health check first to give a clear error if backend is down
    const health = await fetch('/api/mirai/health').catch(() => null);
    if (!health || !health.ok) {
      throw new Error(
        'No se puede conectar al backend. Asegúrate de que uvicorn esté corriendo en el puerto 8000:\n\nuvicorn backend.server:app --port 8000'
      );
    }

    const formData = new FormData();
    for (const dicomFile of files) {
      formData.append('files', dicomFile.file, dicomFile.file.name);
    }

    const response = await fetch('/api/mirai/predict', {
      method: 'POST',
      body: formData,
    }).catch(() => {
      throw new Error('Conexión rechazada al enviar archivos. Verifica que el backend esté activo en puerto 8000.');
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(err.detail ?? 'Error al procesar los archivos DICOM');
    }

    const data = await response.json();
    return {
      predictions: data.predictions,
      modelVersion: data.modelVersion,
    };
  }

  async getModelInfo(): Promise<{ version: string; description: string }> {
    const response = await fetch('/api/mirai/health').catch(() => null);
    const version = response?.ok
      ? (await response.json()).modelVersion
      : '0.14.1';
    return {
      version,
      description: 'Modelo Mirai para predicción de riesgo de cáncer de mama basado en mamografías',
    };
  }
}

export const miraiService = MiraiService.getInstance();
