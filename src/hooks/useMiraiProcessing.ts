import { useState, useCallback } from 'react';
import { DicomFile, ProcessingStatus } from '../types/mirai';
import { miraiService } from '../services/miraiService';

export function useMiraiProcessing() {
  const [status, setStatus] = useState<ProcessingStatus>({
    status: 'idle',
    progress: 0,
    message: ''
  });

  const processFiles = useCallback(async (files: DicomFile[]) => {
    try {
      // Fase de carga
      setStatus({
        status: 'uploading',
        progress: 0,
        message: 'Preparando archivos DICOM...'
      });

      // Simular progreso de carga
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setStatus(prev => ({
          ...prev,
          progress: i,
          message: `Cargando archivos... ${i}%`
        }));
      }

      // Fase de procesamiento
      setStatus({
        status: 'processing',
        progress: 0,
        message: 'Ejecutando modelo Mirai...'
      });

      // Simular progreso de procesamiento
      const progressSteps = [
        { progress: 20, message: 'Preprocesando imágenes...' },
        { progress: 40, message: 'Extrayendo características...' },
        { progress: 60, message: 'Ejecutando red neuronal...' },
        { progress: 80, message: 'Calculando predicciones...' },
        { progress: 100, message: 'Finalizando análisis...' }
      ];

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setStatus(prev => ({
          ...prev,
          progress: step.progress,
          message: step.message
        }));
      }

      // Procesar con el servicio
      const result = await miraiService.processDicomFiles(files);

      setStatus({
        status: 'completed',
        progress: 100,
        message: 'Análisis completado exitosamente',
        result
      });

    } catch (error) {
      setStatus({
        status: 'error',
        progress: 0,
        message: 'Error durante el procesamiento',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }, []);

  const reset = useCallback(() => {
    setStatus({
      status: 'idle',
      progress: 0,
      message: ''
    });
  }, []);

  return {
    status,
    processFiles,
    reset
  };
}