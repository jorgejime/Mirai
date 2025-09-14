import React from 'react';
import { TrendingUp, Calendar, Info, Download } from 'lucide-react';
import { MiraiResult } from '../types/mirai';
import { getRiskLevel } from '../utils/dicom';

interface ResultsDisplayProps {
  result: MiraiResult;
  onDownload?: () => void;
}

export function ResultsDisplay({ result, onDownload }: ResultsDisplayProps) {
  const predictions = Object.entries(result.predictions).map(([year, risk]) => ({
    year,
    risk: risk * 100, // Convertir a porcentaje
    riskLevel: getRiskLevel(risk)
  }));

  const maxRisk = Math.max(...Object.values(result.predictions)) * 100;
  const overallRiskLevel = getRiskLevel(Math.max(...Object.values(result.predictions)));

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Resumen General */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Resultados de Predicción de Riesgo
            </h2>
          </div>
          {onDownload && (
            <button
              onClick={onDownload}
              className="btn-secondary"
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Riesgo Máximo (5 años)</p>
            <p className="text-2xl font-bold text-gray-900">{maxRisk.toFixed(2)}%</p>
            <span className={`risk-${overallRiskLevel.color} mt-2`}>
              Riesgo {overallRiskLevel.level}
            </span>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Versión del Modelo</p>
            <p className="text-lg font-semibold text-gray-900">
              {result.modelVersion || 'N/A'}
            </p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Tiempo de Procesamiento</p>
            <p className="text-lg font-semibold text-gray-900">
              {result.processingTime ? `${(result.processingTime / 1000).toFixed(1)}s` : 'N/A'}
            </p>
          </div>
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-primary-800">
              <p className="font-medium mb-1">Interpretación de Resultados</p>
              <p>
                Estos valores representan la probabilidad estimada de desarrollar cáncer de mama 
                en los próximos 1-5 años basándose en las mamografías proporcionadas. 
                Los resultados deben ser interpretados por un profesional médico calificado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Predicciones por Año */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Predicciones por Período de Tiempo
          </h3>
        </div>

        <div className="space-y-4">
          {predictions.map(({ year, risk, riskLevel }) => (
            <div key={year} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{year}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Riesgo: {risk.toFixed(3)}%
                    </span>
                    <span className={`risk-${riskLevel.color}`}>
                      {riskLevel.level}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        riskLevel.color === 'success' ? 'bg-success-500' :
                        riskLevel.color === 'warning' ? 'bg-warning-500' : 'bg-error-500'
                      }`}
                      style={{ width: `${Math.min(risk * 5, 100)}%` }} // Escalar para visualización
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Información Adicional */}
      <div className="card bg-gray-50">
        <h4 className="text-md font-semibold text-gray-900 mb-3">
          Información Importante
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• Este modelo fue entrenado en datos de mamografías del Massachusetts General Hospital</p>
          <p>• Los resultados han sido validados en múltiples instituciones internacionales</p>
          <p>• La precisión del modelo (C-index) es de aproximadamente 0.76-0.81</p>
          <p>• Estos resultados son para fines de investigación y deben ser validados clínicamente</p>
        </div>
      </div>
    </div>
  );
}