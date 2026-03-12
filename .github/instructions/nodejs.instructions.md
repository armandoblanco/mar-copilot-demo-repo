---
applyTo: "src/**/*.js"
---

# Instrucciones para archivos Node.js

## Estructura de Rutas (Express)

Cada archivo de rutas debe seguir este patrón:

```javascript
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /resource - Listar con paginación
// GET /resource/:id - Obtener por ID
// POST /resource - Crear nuevo
// PUT /resource/:id - Actualizar
// DELETE /resource/:id - Eliminar

export default router;
```

## Controladores

- Extrae la lógica de negocio a funciones separadas
- Cada handler de ruta debe ser una función async
- Siempre retorna el status code apropiado (200, 201, 204, 400, 401, 404, 500)

## Modelos (Mongoose)

- Define schemas con tipos explícitos y validaciones
- Usa `timestamps: true` en todos los schemas
- Agrega índices para campos que se consultan frecuentemente
- Usa `toJSON` transform para excluir campos sensibles como passwords
