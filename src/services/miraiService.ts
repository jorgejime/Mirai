import { DicomFile, MiraiResult } from '../types/mirai';

export class MiraiService {
  private static instance: MiraiService;
  private baseUrl: string;

  private constructor() {
    // En un entorno real, esto vendría de variables de entorno
    this.baseUrl = '/api/mirai';
  }

  public static getInstance(): MiraiService {
    if (!MiraiService.instance) {
      MiraiService.instance = new MiraiService();
    }
    return MiraiService.instance;
  }

  async processDicomFiles(files: DicomFile[]): Promise<MiraiResult> {
    // Simular el procesamiento de archivos DICOM
    // En un entorno real, esto enviaría los archivos al servidor Python
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular diferentes resultados basados en el nombre del primer archivo
        const firstFileName = files[0].file.name.toLowerCase();
        
        if (firstFileName.includes('error')) {
          reject(new Error('Error al procesar los archivos DICOM'));
          return;
        }

        // Generar predicciones simuladas
        const basePrediction = Math.random() * 0.2; // 0-20% de riesgo base
        
        const predictions = {
          'Year 1': Math.round((basePrediction * 0.3) * 10000) / 10000,
          'Year 2': Math.round((basePrediction * 0.5) * 10000) / 10000,
          'Year 3': Math.round((basePrediction * 0.7) * 10000) / 10000,
          'Year 4': Math.round((basePrediction * 0.9) * 10000) / 10000,
          'Year 5': Math.round(basePrediction * 10000) / 10000,
        };

        resolve({
          predictions,
          modelVersion: '0.14.1',
          processingTime: 2500 + Math.random() * 1000
        });
      }, 2000 + Math.random() * 3000); // Simular tiempo de procesamiento variable
    });
  }

  async getModelInfo(): Promise<{ version: string; description: string }> {
    return {
      version: '0.14.1',
      description: 'Modelo Mirai para predicción de riesgo de cáncer de mama basado en mamografías'
    };
  }
}

export const miraiService = MiraiService.getInstance();