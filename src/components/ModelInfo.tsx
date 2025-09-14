import React from 'react';
import { Info, Award, Globe, Users } from 'lucide-react';

export function ModelInfo() {
  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <Info className="h-6 w-6 text-primary-600" />
        <h2 className="text-xl font-bold text-gray-900">Acerca del Modelo Mirai</h2>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-gray-700 leading-relaxed">
            Mirai es un modelo de inteligencia artificial desarrollado por el MIT y el Massachusetts General Hospital 
            para predecir el riesgo de cáncer de mama basándose en mamografías. El modelo fue entrenado en un gran 
            conjunto de datos y validado en múltiples instituciones internacionales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <Award className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Precisión</h3>
            <p className="text-sm text-gray-600">C-index: 0.76-0.81</p>
          </div>
          
          <div className="text-center p-4 bg-success-50 rounded-lg">
            <Globe className="h-8 w-8 text-success-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Validación</h3>
            <p className="text-sm text-gray-600">3 países, múltiples hospitales</p>
          </div>
          
          <div className="text-center p-4 bg-warning-50 rounded-lg">
            <Users className="h-8 w-8 text-warning-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Datos</h3>
            <p className="text-sm text-gray-600">Miles de mamografías</p>
          </div>
        </div>

        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <h4 className="font-semibold text-warning-800 mb-2">Aviso Importante</h4>
          <p className="text-sm text-warning-700">
            Esta herramienta es solo para fines de investigación y demostración. Los resultados no deben 
            utilizarse para tomar decisiones médicas sin la supervisión de un profesional de la salud calificado.
          </p>
        </div>
      </div>
    </div>
  );
}