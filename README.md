# Aplicación Web Mirai

Una aplicación web moderna para ejecutar el modelo Mirai de predicción de riesgo de cáncer de mama.

## Características

- **Interfaz Intuitiva**: Diseño limpio y fácil de usar para cargar archivos DICOM
- **Validación de Archivos**: Verificación automática de que se proporcionen las 4 vistas requeridas (L CC, L MLO, R CC, R MLO)
- **Procesamiento en Tiempo Real**: Indicadores de progreso durante el análisis
- **Resultados Detallados**: Visualización clara de las predicciones de riesgo por año
- **Descarga de Resultados**: Exportación de resultados en formato JSON
- **Responsive**: Optimizada para dispositivos móviles y de escritorio

## Tecnologías Utilizadas

- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Vite** como bundler
- **Lucide React** para iconos

## Instalación y Uso

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes React reutilizables
│   ├── FileUpload.tsx   # Componente de carga de archivos
│   ├── Header.tsx       # Encabezado de la aplicación
│   ├── ModelInfo.tsx    # Información del modelo
│   ├── ProcessingStatus.tsx # Estado del procesamiento
│   └── ResultsDisplay.tsx   # Visualización de resultados
├── hooks/               # Custom hooks
│   └── useMiraiProcessing.ts # Hook para procesamiento
├── services/            # Servicios de API
│   └── miraiService.ts  # Servicio para comunicación con Mirai
├── types/               # Definiciones de tipos TypeScript
│   └── mirai.ts         # Tipos relacionados con Mirai
├── utils/               # Utilidades
│   └── dicom.ts         # Funciones para manejo de DICOM
└── App.tsx              # Componente principal
```

## Integración con Mirai

Esta aplicación está diseñada para integrarse con el modelo Mirai. Para una implementación completa:

1. **Backend Python**: Implementar un servidor que ejecute el modelo Mirai
2. **API REST**: Crear endpoints para recibir archivos DICOM y devolver predicciones
3. **Procesamiento DICOM**: Integrar las funciones de preprocesamiento de Mirai
4. **Autenticación**: Añadir sistema de autenticación para uso clínico

## Características de Seguridad

- Validación de archivos en el frontend
- Manejo seguro de errores
- Avisos claros sobre el uso apropiado del modelo

## Contribuir

Este proyecto está basado en el trabajo de investigación publicado en Science Translational Medicine. Para contribuir o reportar problemas, consulta el repositorio original de Mirai.

## Licencia

MIT License - Ver el archivo LICENSE para más detalles.