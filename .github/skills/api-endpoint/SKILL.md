---
name: api-endpoint
description: >
  Crea endpoints REST completos con Express.js siguiendo los estándares del proyecto.
  Usa este skill cuando te pidan crear rutas, endpoints, APIs, o recursos CRUD.
  Incluye modelo, rutas, validaciones, y registro en app.js.
---

# Skill: API Endpoint Creator

Cuando necesites crear un nuevo endpoint REST, sigue estos pasos detallados.

## Paso 1: Crear el Modelo

Crea el archivo `src/models/{recurso}.js`:

```javascript
import mongoose from 'mongoose';

const { Schema } = mongoose;

const recursoSchema = new Schema(
  {
    // Definir campos con tipos explícitos
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    // ... más campos según el recurso
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Agregar índices según campos de búsqueda frecuente
recursoSchema.index({ nombre: 1 });

const Recurso = mongoose.model('Recurso', recursoSchema);

export default Recurso;
```

## Paso 2: Crear las Rutas

Crea el archivo `src/routes/{recurso}.js` con CRUD completo:

```javascript
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import Recurso from '../models/{recurso}.js';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticate);

/**
 * @route   GET /api/{recurso}
 * @desc    Listar con paginación
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    validate,
  ],
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        Recurso.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
        Recurso.countDocuments(),
      ]);

      res.json({
        success: true,
        data,
        meta: { page, limit, total },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ... POST, GET/:id, PUT/:id, DELETE/:id siguen el mismo patrón

export default router;
```

## Paso 3: Registrar en app.js

Agrega en `src/app.js`:

```javascript
import recursoRoutes from './routes/{recurso}.js';
app.use('/api/{recurso}', recursoRoutes);
```

## Paso 4: Validaciones

Siempre incluye validaciones con `express-validator`:

- `body('campo').notEmpty().withMessage('Campo requerido')`
- `body('email').isEmail().normalizeEmail()`
- `body('precio').isFloat({ min: 0 })`
- `param('id').isMongoId().withMessage('ID inválido')`

## Reglas Importantes

- SIEMPRE usa `async/await` con `try/catch`
- SIEMPRE aplica el middleware `authenticate`
- SIEMPRE valida inputs antes de procesarlos
- SIEMPRE retorna el formato estándar: `{ success, data, meta }`
- NUNCA uses `console.log`, usa el logger del proyecto
