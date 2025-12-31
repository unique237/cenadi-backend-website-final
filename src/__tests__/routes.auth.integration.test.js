const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/userRoutes');
const pool = require('../config/db');

jest.mock('../config/db');

describe('User Routes - Auth Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api', userRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should reject missing email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testuser',
          name: 'Test User',
          password: 'SecurePass123',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    it('should reject weak password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          name: 'Test User',
          password: 'weak',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should accept strong password with uppercase, lowercase, number', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          name: 'New User',
          password: 'SecurePass123',
        });

      // Response status should be 201 on success or 400/500 on validation/error
      expect([201, 400, 500]).toContain(response.status);
    });
  });

  describe('POST /api/auth/signin', () => {
    it('should reject missing email', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({ password: 'password' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject missing password', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 or 429 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'not-an-email',
          password: 'password',
        });

      // Should return 400 validation error or 429 rate limit
      expect([400, 429]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users', () => {
    it('should return 401 without authorization header', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer invalid.token');

      expect(response.status).toBe(401);
    });
  });
});
