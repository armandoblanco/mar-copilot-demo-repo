# AGENTS.md

## Proyecto

API REST con Node.js + Express + MongoDB para gestión de usuarios y productos.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Estructura

- `src/app.js` - Entry point de Express
- `src/routes/` - Definición de rutas REST
- `src/models/` - Modelos Mongoose
- `src/middleware/` - Middlewares (auth, validación, errores)
- `src/utils/` - Utilidades compartidas
- `tests/` - Tests con Jest + Supertest

## Convenciones

- ES Modules (`import/export`)
- async/await con try/catch
- JSDoc en funciones públicas
- Validación con express-validator
- Logging con winston (nunca console.log)
- Formato de respuesta: `{ success, data, meta }`

## Tests

```bash
npm test            # Correr tests con cobertura
npm run test:watch  # Modo watch
```

## Skills Disponibles

- `api-endpoint`: Crea endpoints REST completos
- `unit-testing`: Genera tests siguiendo patrones del proyecto

## Custom Agents Disponibles

- `@planner`: Planifica features sin tocar código. Handoff → @implementer, @security-reviewer
- `@implementer`: Implementa código siguiendo convenciones. Handoff → @test-writer, @security-reviewer
- `@security-reviewer`: Audita código (solo lectura). Handoff → @implementer
- `@test-writer`: Genera tests en `tests/` (no modifica `src/`). Handoff → @security-reviewer
- `@docs-writer`: Genera documentación API y guías
