import { DicomFile } from '../types/mirai';

export function validateDicomFiles(files: File[]): { isValid: boolean; message: string } {
  if (files.length !== 4) {
    return {
      isValid: false,
      message: `Se requieren exactamente 4 archivos DICOM. Se proporcionaron ${files.length}.`
    };
  }

  const requiredViews = ['L CC', 'L MLO', 'R CC', 'R MLO'];
  const providedViews: string[] = [];

  for (const file of files) {
    // Intentar extraer información de la vista del nombre del archivo
    const fileName = file.name.toUpperCase();
    let view = '';
    
    if (fileName.includes('L') && fileName.includes('CC')) {
      view = 'L CC';
    } else if (fileName.includes('L') && (fileName.includes('MLO') || fileName.includes('ML'))) {
      view = 'L MLO';
    } else if (fileName.includes('R') && fileName.includes('CC')) {
      view = 'R CC';
    } else if (fileName.includes('R') && (fileName.includes('MLO') || fileName.includes('ML'))) {
      view = 'R MLO';
    }
    
    if (view) {
      providedViews.push(view);
    }
  }

  const missingViews = requiredViews.filter(view => !providedViews.includes(view));
  
  if (missingViews.length > 0) {
    return {
      isValid: false,
      message: `Faltan las siguientes vistas: ${missingViews.join(', ')}. Se requieren: L CC, L MLO, R CC, R MLO.`
    };
  }

  return {
    isValid: true,
    message: 'Archivos DICOM válidos'
  };
}

export function parseDicomFiles(files: File[]): DicomFile[] {
  return files.map((file, index) => {
    const fileName = file.name.toUpperCase();
    let view: 'CC' | 'MLO' = 'CC';
    let laterality: 'L' | 'R' = 'L';

    // Extraer vista
    if (fileName.includes('MLO') || fileName.includes('ML')) {
      view = 'MLO';
    }

    // Extraer lateralidad
    if (fileName.includes('R')) {
      laterality = 'R';
    }

    return {
      file,
      view,
      laterality,
      id: `${laterality}_${view}_${index}`
    };
  });
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