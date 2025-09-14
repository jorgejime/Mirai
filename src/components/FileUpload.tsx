import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { DicomFile } from '../types/mirai';
import { validateDicomFiles, parseDicomFiles } from '../utils/dicom';

interface FileUploadProps {
  onFilesSelected: (files: DicomFile[]) => void;
  disabled?: boolean;
}

export function FileUpload({ onFilesSelected, disabled = false }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<DicomFile[]>([]);
  const [validationError, setValidationError] = useState<string>('');

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validation = validateDicomFiles(fileArray);
    
    if (!validation.isValid) {
      setValidationError(validation.message);
      return;
    }

    setValidationError('');
    const dicomFiles = parseDicomFiles(fileArray);
    setSelectedFiles(dicomFiles);
    onFilesSelected(dicomFiles);
  }, [onFilesSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  }, [handleFiles, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const removeFile = useCallback((fileId: string) => {
    const updatedFiles = selectedFiles.filter(f => f.id !== fileId);
    setSelectedFiles(updatedFiles);
    if (updatedFiles.length === 0) {
      onFilesSelected([]);
    }
  }, [selectedFiles, onFilesSelected]);

  const clearAll = useCallback(() => {
    setSelectedFiles([]);
    setValidationError('');
    onFilesSelected([]);
  }, [onFilesSelected]);

  return (
    <div className="space-y-4">
      <div
        className={`file-drop-zone ${dragOver ? 'drag-over' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && document.getElementById('file-input')?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            Arrastra y suelta archivos DICOM aquí
          </p>
          <p className="text-sm text-gray-500">
            o haz clic para seleccionar archivos
          </p>
          <p className="text-xs text-gray-400">
            Se requieren 4 archivos: L CC, L MLO, R CC, R MLO
          </p>
        </div>
        <input
          id="file-input"
          type="file"
          multiple
          accept=".dcm,.dicom"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {validationError && (
        <div className="flex items-center space-x-2 p-3 bg-error-50 border border-error-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-error-600 flex-shrink-0" />
          <p className="text-sm text-error-700">{validationError}</p>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Archivos Seleccionados ({selectedFiles.length}/4)
            </h3>
            <button
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Limpiar todo
            </button>
          </div>
          
          <div className="space-y-2">
            {selectedFiles.map((dicomFile) => (
              <div
                key={dicomFile.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {dicomFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dicomFile.laterality} {dicomFile.view} • {(dicomFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(dicomFile.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}