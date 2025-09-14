import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ProcessingStatus } from './components/ProcessingStatus';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ModelInfo } from './components/ModelInfo';
import { DicomFile } from './types/mirai';
import { useMiraiProcessing } from './hooks/useMiraiProcessing';

function App() {
  const [selectedFiles, setSelectedFiles] = useState<DicomFile[]>([]);
  const { status, processFiles, reset } = useMiraiProcessing();

  const handleFilesSelected = useCallback((files: DicomFile[]) => {
    setSelectedFiles(files);
    if (status.status !== 'idle') {
      reset();
    }
  }, [status.status, reset]);

  const handleProcessFiles = useCallback(async () => {
    if (selectedFiles.length === 4) {
      await processFiles(selectedFiles);
    }
  }, [selectedFiles, processFiles]);

  const handleReset = useCallback(() => {
    setSelectedFiles([]);
    reset();
  }, [reset]);

  const handleDownloadResults = useCallback(() => {
    if (status.result) {
      const dataStr = JSON.stringify(status.result, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mirai_prediction_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [status.result]);

  const canProcess = selectedFiles.length === 4 && status.status === 'idle';
  const isProcessing = status.status === 'uploading' || status.status === 'processing';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Información del Modelo */}
          <ModelInfo />

          {/* Carga de Archivos */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Cargar Archivos DICOM
            </h2>
            <FileUpload 
              onFilesSelected={handleFilesSelected}
              disabled={isProcessing}
            />
            
            {selectedFiles.length === 4 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-success-700 font-medium">
                  ✓ Todos los archivos requeridos han sido cargados
                </p>
                <div className="space-x-3">
                  <button
                    onClick={handleReset}
                    className="btn-secondary"
                    disabled={isProcessing}
                  >
                    Reiniciar
                  </button>
                  <button
                    onClick={handleProcessFiles}
                    className="btn-primary"
                    disabled={!canProcess}
                  >
                    {isProcessing ? 'Procesando...' : 'Ejecutar Análisis'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Estado del Procesamiento */}
          <ProcessingStatus status={status} />

          {/* Resultados */}
          {status.result && (
            <ResultsDisplay 
              result={status.result}
              onDownload={handleDownloadResults}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>
              Desarrollado por el MIT y Massachusetts General Hospital. 
              Publicado en <em>Science Translational Medicine</em>.
            </p>
            <p className="mt-2">
              Para uso en investigación únicamente. No para diagnóstico clínico.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;