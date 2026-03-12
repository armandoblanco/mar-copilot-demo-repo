/**
 * Valida que un string sea un email válido
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitiza un string removiendo caracteres peligrosos
 * @param {string} input - String a sanitizar
 * @returns {string}
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/[<>'"]/g, '').trim();
}

/**
 * Valida que un password cumple los requisitos mínimos
 * @param {string} password - Password a validar
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validatePassword(password) {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Debe contener al menos un número');
  }

  return { valid: errors.length === 0, errors };
}
