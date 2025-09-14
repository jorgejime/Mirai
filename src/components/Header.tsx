import React from 'react';
import { Brain, Github, ExternalLink } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Brain className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mirai</h1>
                <p className="text-xs text-gray-500">Predicción de Riesgo de Cáncer de Mama</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="https://www.science.org/doi/10.1126/scitranslmed.aba4373"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Publicación Científica</span>
            </a>
            <a
              href="https://github.com/reginabarzilaygroup/Mirai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}