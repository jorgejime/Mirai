import { DicomFile } from '../types/mirai';

// Validation is now handled by the slot-based FileUpload component.
// Files are assigned to specific views (L CC, L MLO, R CC, R MLO) by the user directly.
export function validateDicomFiles(_files: File[]): { isValid: boolean; message: string } {
  return { isValid: true, message: 'OK' };
}

export function parseDicomFiles(files: File[]): DicomFile[] {
  return files.map((file, index) => ({
    file,
    view: 'CC',
    laterality: 'L',
    id: `file_${index}`,
  }));
}

export function getRiskLevel(prediction: number): { level: 'bajo' | 'moderado' | 'alto'; color: string } {
  if (prediction < 0.05) {
    return { level: 'bajo', color: 'success' };
  } else if (prediction < 0.15) {
    return { level: 'moderado', color: 'warning' };
  } else {
    return { level: 'alto', color: 'error' };
  }
}