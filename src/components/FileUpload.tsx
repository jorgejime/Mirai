import React, { useCallback, useRef } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';
import { DicomFile } from '../types/mirai';

interface FileUploadProps {
  onFilesSelected: (files: DicomFile[]) => void;
  disabled?: boolean;
}

const SLOTS: { view: 'CC' | 'MLO'; laterality: 'L' | 'R'; label: string; description: string }[] = [
  { view: 'CC', laterality: 'L', label: 'L CC', description: 'Cráneo-caudal izquierda' },
  { view: 'MLO', laterality: 'L', label: 'L MLO', description: 'Medio-lateral oblicua izquierda' },
  { view: 'CC', laterality: 'R', label: 'R CC', description: 'Cráneo-caudal derecha' },
  { view: 'MLO', laterality: 'R', label: 'R MLO', description: 'Medio-lateral oblicua derecha' },
];

export function FileUpload({ onFilesSelected, disabled = false }: FileUploadProps) {
  const [slotFiles, setSlotFiles] = React.useState<Record<string, File | null>>({
    'L_CC': null, 'L_MLO': null, 'R_CC': null, 'R_MLO': null,
  });
  const [dragOver, setDragOver] = React.useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const notifyParent = useCallback((updated: Record<string, File | null>) => {
    const dicomFiles: DicomFile[] = [];
    for (const slot of SLOTS) {
      const key = `${slot.laterality}_${slot.view}`;
      const file = updated[key];
      if (file) {
        dicomFiles.push({ file, view: slot.view, laterality: slot.laterality, id: key });
      }
    }
    onFilesSelected(dicomFiles);
  }, [onFilesSelected]);

  const assignFile = useCallback((slotKey: string, file: File) => {
    setSlotFiles(prev => {
      const updated = { ...prev, [slotKey]: file };
      notifyParent(updated);
      return updated;
    });
  }, [notifyParent]);

  const clearSlot = useCallback((slotKey: string) => {
    setSlotFiles(prev => {
      const updated = { ...prev, [slotKey]: null };
      notifyParent(updated);
      return updated;
    });
  }, [notifyParent]);

  const handleDrop = useCallback((e: React.DragEvent, slotKey: string) => {
    e.preventDefault();
    setDragOver(null);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) assignFile(slotKey, file);
  }, [assignFile, disabled]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, slotKey: string) => {
    const file = e.target.files?.[0];
    if (file) assignFile(slotKey, file);
    // Reset so same file can be re-selected
    e.target.value = '';
  }, [assignFile]);

  const totalLoaded = Object.values(slotFiles).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {SLOTS.map(slot => {
          const key = `${slot.laterality}_${slot.view}`;
          const file = slotFiles[key];
          const isOver = dragOver === key;

          return (
            <div
              key={key}
              className={`
                relative rounded-xl border-2 p-4 transition-all
                ${file ? 'border-green-400 bg-green-50' : isOver ? 'border-primary-400 bg-primary-50' : 'border-dashed border-gray-300 bg-gray-50'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary-400 hover:bg-primary-50'}
              `}
              onDragOver={e => { e.preventDefault(); if (!disabled) setDragOver(key); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => handleDrop(e, key)}
              onClick={() => !disabled && inputRefs.current[key]?.click()}
            >
              <input
                ref={el => { inputRefs.current[key] = el; }}
                type="file"
                className="hidden"
                onChange={e => handleFileInput(e, key)}
                disabled={disabled}
              />

              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-primary-100 text-primary-700 mb-1">
                    {slot.label}
                  </span>
                  <p className="text-xs text-gray-500">{slot.description}</p>
                </div>
                {file && (
                  <button
                    onClick={e => { e.stopPropagation(); clearSlot(key); }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="mt-3 flex items-center space-x-2">
                {file ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <p className="text-sm text-gray-400">
                      {isOver ? 'Suelta aquí' : 'Clic o arrastra el archivo'}
                    </p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Acepta cualquier archivo DICOM (.dcm, sin extensión, etc.) — {totalLoaded}/4 cargados
      </p>
    </div>
  );
}
