export interface DicomFile {
  file: File;
  view: 'CC' | 'MLO';
  laterality: 'L' | 'R';
  id: string;
}

export interface MiraiPrediction {
  'Year 1': number;
  'Year 2': number;
  'Year 3': number;
  'Year 4': number;
  'Year 5': number;
}

export interface MiraiResult {
  predictions: MiraiPrediction;
  modelVersion?: string;
  processingTime?: number;
}

export interface ProcessingStatus {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  result?: MiraiResult;
  error?: string;
}