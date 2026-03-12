---
agent: 'agent'
description: 'Crea un nuevo endpoint REST completo con validación, autenticación y tests'
---

# Crear Endpoint REST

Crea un endpoint REST completo para el recurso que el usuario especifique.

## Pasos a seguir:

1. **Modelo**: Crea el modelo Mongoose en `src/models/` con:
   - Schema con tipos explícitos y validaciones
   - Timestamps habilitados
   - Índices necesarios
   - Transform de `toJSON` para excluir campos sensibles

2. **Rutas**: Crea el archivo de rutas en `src/routes/` con:
   - CRUD completo (GET lista, GET por ID, POST, PUT, DELETE)
   - Validaciones con `express-validator` en cada ruta
   - Middleware de autenticación
   - Paginación en el endpoint de lista

3. **Registrar ruta**: Agrega la nueva ruta en `src/app.js`

4. **Tests**: Crea tests en `tests/` con:
   - Happy path para cada endpoint
   - Tests de validación de inputs
   - Tests de autenticación
   - Tests de recurso no encontrado

## Formato de respuesta estándar del proyecto:

```json
{
  "success": true,
  "data": {},
  "meta": { "page": 1, "limit": 20, "total": 0 }
}
```

Sigue las convenciones definidas en el archivo [copilot-instructions.md](../copilot-instructions.md).
