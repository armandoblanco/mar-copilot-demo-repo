import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

/**
 * Middleware de autenticación JWT
 * Verifica el token en el header Authorization
 */
export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Token de autenticación requerido' },
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Token inválido:', { error: error.message });
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Token inválido o expirado' },
    });
  }
}
