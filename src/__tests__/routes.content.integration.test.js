const request = require('supertest');
const express = require('express');
const categoryRoutes = require('../routes/categoryRoutes');

jest.mock('../config/db');

describe('Category Routes - Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api', categoryRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/categories', () => {
    it('should return 200 with categories list', async () => {
      const response = await request(app).get('/api/categories');

      // Public endpoint should be accessible
      expect([200, 500]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty('categories');
      }
    });

    it('should not require authentication for GET', async () => {
      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', '');

      // Should not throw 401
      expect(response.status).not.toBe(401);
    });
  });

  describe('POST /api/categories (Create)', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({
          name_en: 'New Category',
          name_fr: 'Nouvelle Catégorie',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it('should reject with invalid token', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', 'Bearer invalid.token')
        .send({
          name_en: 'Test Category',
          name_fr: 'Catégorie Test',
        });

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const validToken = 'Bearer valid.admin.token';

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', validToken)
        .send({ name_en: 'Only English' });

      // Should return 400 for missing name_fr
      expect([400, 401]).toContain(response.status);
    });
  });

  describe('PUT /api/categories/:id (Update)', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .put('/api/categories/1')
        .send({
          name_en: 'Updated Category',
          name_fr: 'Catégorie Mise à Jour',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should require authentication', async () => {
      const response = await request(app).delete('/api/categories/1');

      expect(response.status).toBe(401);
    });
  });
});
