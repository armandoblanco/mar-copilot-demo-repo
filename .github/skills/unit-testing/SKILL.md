---
name: unit-testing
description: >
  Genera tests unitarios y de integración con Jest y Supertest.
  Usa este skill cuando te pidan crear tests, escribir pruebas,
  agregar cobertura, o verificar funcionalidad.
---

# Skill: Unit Testing Framework

Cuando necesites crear tests, sigue estos lineamientos.

## Setup del Entorno de Tests

### Archivo de configuración: `jest.config.js`

```javascript
export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: [],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
};
```

### Helper de base de datos: `tests/helpers/db.js`

```javascript
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

export async function connectTestDB() {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
}

export async function disconnectTestDB() {
  await mongoose.disconnect();
  await mongoServer.stop();
}

export async function clearTestDB() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}
```

## Estructura de Tests para Endpoints

```javascript
import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, disconnectTestDB, clearTestDB } from './helpers/db.js';
import { generateTestToken } from './helpers/auth.js';

describe('RECURSO Endpoints', () => {
  let authToken;

  beforeAll(async () => {
    await connectTestDB();
    authToken = generateTestToken({ id: 'test-user-id', role: 'admin' });
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  describe('GET /api/recurso', () => {
    it('should return paginated list when authenticated', async () => {
      // Arrange - insertar datos de prueba
      // Act
      const res = await request(app)
        .get('/api/recurso')
        .set('Authorization', `Bearer ${authToken}`);
      // Assert
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.meta).toHaveProperty('total');
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app).get('/api/recurso');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/recurso', () => {
    it('should create resource when data is valid', async () => {
      // Arrange
      const newItem = { nombre: 'Test Item', /* ... */ };
      // Act
      const res = await request(app)
        .post('/api/recurso')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newItem);
      // Assert
      expect(res.status).toBe(201);
      expect(res.body.data.nombre).toBe('Test Item');
    });

    it('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/recurso')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
```

## Reglas para Tests

1. **SIEMPRE** usa el patrón Arrange-Act-Assert
2. **SIEMPRE** limpia la base de datos entre tests (`afterEach`)
3. **SIEMPRE** describe el comportamiento esperado: "should X when Y"
4. **NUNCA** hagas tests que dependan del orden de ejecución
5. **NUNCA** uses datos de producción o secrets reales
6. Cada endpoint necesita tests para: happy path, validación, auth, 404, y errores
