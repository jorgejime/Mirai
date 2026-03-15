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
    const formData = new FormData();
    for (const dicomFile of files) {
      formData.append('files', dicomFile.file, dicomFile.file.name);
    }

    const response = await fetch('/api/mirai/predict', {
      method: 'POST',
      body: formData,
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
