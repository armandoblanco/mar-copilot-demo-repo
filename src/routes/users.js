import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const router = Router();

// ============================================================
// ⚠️ ESTE ARCHIVO TIENE BUGS INTENCIONALES PARA LA DEMO
// Copilot Code Review debería detectar estos problemas:
//
// 🔴 BUG 1: Secret hardcodeado (línea ~25)
// 🔴 BUG 2: Password en respuesta de registro (línea ~42)
// 🔴 BUG 3: NoSQL injection en login (línea ~54)
// 🟡 BUG 4: console.log en lugar de logger (líneas varias)
// 🟡 BUG 5: Falta try/catch en DELETE (línea ~100)
// 🟡 BUG 6: Falta autenticación en GET lista (línea ~70)
// 🔵 BUG 7: Falta JSDoc en funciones
// 🔵 BUG 8: Formato de respuesta inconsistente
// ============================================================

// 🔴 BUG 1: Secret hardcodeado - debería venir de process.env
const JWT_SECRET = 'mi-super-secret-key-12345';

/**
 * @route   POST /api/users/register
 * @desc    Registrar nuevo usuario
 */
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Nombre requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres'),
    validate,
  ],
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const user = new User({ name, email, password });
      await user.save();

      // 🔴 BUG 2: Retornando el objeto user sin transformar - expone el password
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });

      // 🔵 BUG 8: Formato de respuesta inconsistente (no sigue { success, data })
      res.status(201).json({
        message: 'Usuario creado',
        user: user,
        token,
      });
    } catch (error) {
      // 🟡 BUG 4: Usando console.log en lugar de logger
      console.log('Error en registro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

/**
 * @route   POST /api/users/login
 * @desc    Iniciar sesión
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔴 BUG 3: NoSQL injection - el input no está validado ni sanitizado
    // Un atacante podría enviar { "email": { "$gt": "" }, "password": { "$gt": "" } }
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '24h',
    });

    console.log(`Usuario ${email} inició sesión`); // 🟡 BUG 4

    res.json({ success: true, data: { token, user: user.toJSON() } });
  } catch (error) {
    console.log('Error en login:', error); // 🟡 BUG 4
    res.status(500).json({ error: 'Error interno' });
  }
});

// 🟡 BUG 6: Falta middleware de autenticación - cualquiera puede listar usuarios
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    res.json({
      success: true,
      data: users,
      meta: { page, limit, total },
    });
  } catch (error) {
    console.log('Error listando usuarios:', error); // 🟡 BUG 4
    res.status(500).json({ error: 'Error interno' });
  }
});

// 🔵 BUG 7: Falta JSDoc
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// 🟡 BUG 5: Falta try/catch - si falla, crashea el servidor
router.delete('/:id', authenticate, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  res.status(204).send();
});

export default router;
