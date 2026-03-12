# GitHub Copilot - Instrucciones del Proyecto

## Contexto del Proyecto

Este es un API REST construido con **Node.js + Express** para gestionar usuarios y productos.
Base de datos: MongoDB con Mongoose. Testing: Jest + Supertest.

## Convenciones de Código

- Usa **ES Modules** (`import/export`), no CommonJS (`require`)
- Usa **async/await** en lugar de callbacks o `.then()`
- Todas las funciones públicas deben tener documentación **JSDoc**
- Nombres de variables y funciones en **camelCase**
- Nombres de clases y modelos en **PascalCase**
- Constantes en **UPPER_SNAKE_CASE**

## Manejo de Errores

- Siempre envuelve operaciones async en bloques `try/catch`
- Usa el middleware centralizado de errores (`src/middleware/errorHandler.js`)
- Nunca expongas stack traces en producción
- Retorna errores con el formato: `{ error: { code: string, message: string } }`

## Estructura de Respuestas API

```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

## Seguridad

- Valida TODOS los inputs con `express-validator`
- Sanitiza datos antes de guardar en la base de datos
- No guardes contraseñas en texto plano (usa bcrypt con salt rounds = 12)
- Usa variables de entorno para secrets (nunca hardcodear)

## Logging

- Usa `winston` para logging
- Niveles: error, warn, info, debug
- Incluye timestamp y request ID en cada log
