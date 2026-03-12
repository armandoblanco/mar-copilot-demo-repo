import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/users.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (debe ir al final)
app.use(errorHandler);

// Conectar a MongoDB e iniciar servidor
async function startServer() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/copilot-demo';
    await mongoose.connect(mongoUri);
    logger.info('Conectado a MongoDB');

    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    logger.error('Error al iniciar servidor:', error);
    process.exit(1);
  }
}

// Solo iniciar si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
