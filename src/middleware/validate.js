import { validationResult } from 'express-validator';

/**
 * Middleware que verifica los resultados de express-validator
 * Si hay errores de validación, retorna 400 con los detalles
 */
export function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Datos de entrada inválidos',
        details: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      },
    });
  }

  next();
}
