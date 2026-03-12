import request from 'supertest';
import app from '../src/app.js';

describe('Users Endpoints', () => {
  describe('POST /api/users/register', () => {
    it('should create a new user when data is valid', async () => {
      // Arrange
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePass123',
      };

      // Act
      const res = await request(app).post('/api/users/register').send(newUser);

      // Assert
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 400 when email is invalid', async () => {
      // Arrange
      const invalidUser = {
        name: 'Test',
        email: 'not-an-email',
        password: 'SecurePass123',
      };

      // Act
      const res = await request(app).post('/api/users/register').send(invalidUser);

      // Assert
      expect(res.status).toBe(400);
    });

    it('should return 400 when password is too short', async () => {
      // Arrange
      const weakUser = {
        name: 'Test',
        email: 'test@example.com',
        password: '123',
      };

      // Act
      const res = await request(app).post('/api/users/register').send(weakUser);

      // Assert
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/users', () => {
    it('should return paginated user list', async () => {
      const res = await request(app).get('/api/users?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.meta).toHaveProperty('total');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
});
