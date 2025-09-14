import React from 'react';
import { Loader2, CheckCircle, AlertCircle, Brain } from 'lucide-react';
import { ProcessingStatus as Status } from '../types/mirai';

interface ProcessingStatusProps {
  status: Status;
}

export function ProcessingStatus({ status }: ProcessingStatusProps) {
  const getStatusIcon = () => {
    switch (status.status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-6 w-6 animate-spin text-primary-600" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-success-600" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-error-600" />;
      default:
        return <Brain className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'uploading':
      case 'processing':
        return 'border-primary-200 bg-primary-50';
      case 'completed':
        return 'border-success-200 bg-success-50';
      case 'error':
        return 'border-error-200 bg-error-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (status.status === 'idle') {
    return null;
  }

  return (
    <div className={`card border-2 ${getStatusColor()} animate-fade-in`}>
      <div className="flex items-center space-x-4">
        {getStatusIcon()}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Estado del Procesamiento
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            {status.message}
          </p>
          
          {(status.status === 'uploading' || status.status === 'processing') && (
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${status.progress}%` }}
              />
            </div>
          )}
          
          {status.error && (
            <div className="mt-3 p-3 bg-error-100 border border-error-200 rounded-lg">
              <p className="text-sm text-error-700">{status.error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}