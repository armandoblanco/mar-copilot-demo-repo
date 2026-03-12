import logger from '../utils/logger.js';

/**
 * Middleware centralizado de manejo de errores
 * Debe registrarse como el último middleware en app.js
 */
export function errorHandler(err, req, res, next) {
  logger.error('Error no manejado:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Errores de Mongoose - duplicado
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: { code: 'DUPLICATE_KEY', message: 'El recurso ya existe' },
    });
  }

  // Errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Datos inválidos', details },
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'Error interno del servidor'
        : err.message,
    },
  });
}
