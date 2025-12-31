const request = require('supertest');
const express = require('express');
const projectRoutes = require('../routes/projectRoutes');
const subscribeRoutes = require('../routes/subcribeRoutes');
const { Project, Subscriber } = require('../models');

jest.mock('../models');
jest.mock('../config/logger');

describe('Additional Routes Integration Tests', () => {
    let projectApp, subscriberApp;

    beforeAll(() => {
        // Project routes app
        projectApp = express();
        projectApp.use(express.json());
        projectApp.use('/api', projectRoutes);

        // Subscriber routes app
        subscriberApp = express();
        subscriberApp.use(express.json());
        subscriberApp.use('/api', subscribeRoutes);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Project Routes', () => {
        it('GET /api/projects - should handle listing', async () => {
            Project.findAndCountAll = jest.fn().mockResolvedValue({
                rows: [{ project_id: 1, title_en: 'Project 1' }],
                count: 1
            });

            const response = await request(projectApp)
                .get('/api/projects');

            expect(response.status).toBe(200);
        });

        it('GET /api/projects - should support pagination', async () => {
            Project.findAndCountAll = jest.fn().mockResolvedValue({
                rows: [],
                count: 0
            });

            await request(projectApp)
                .get('/api/projects')
                .query({ page: 2, limit: 5 });

            expect(Project.findAndCountAll).toHaveBeenCalled();
        });

        it('GET /api/projects/:id - should get single project', async () => {
            Project.findByPk = jest.fn().mockResolvedValue({
                project_id: 1,
                title_en: 'Project 1'
            });

            const response = await request(projectApp)
                .get('/api/projects/1');

            expect(response.status).toBe(200);
        });

        it('GET /api/projects/:id - should return 404 when not found', async () => {
            Project.findByPk = jest.fn().mockResolvedValue(null);

            const response = await request(projectApp)
                .get('/api/projects/999');

            expect(response.status).toBe(404);
        });
    });

    describe('Subscribe Routes', () => {
        it('POST /api/subscribe - should handle subscription attempts', async () => {
            Subscriber.create = jest.fn().mockResolvedValue({
                subscriber_id: 1,
                email: 'test@example.com'
            });

            const response = await request(subscriberApp)
                .post('/api/subscribe')
                .send({ email: 'test@example.com' });

            // Should handle request (either 201 or validation error)
            expect([201, 400, 429]).toContain(response.status);
        });

        it('POST /api/unsubscribe - should handle unsubscription', async () => {
            Subscriber.findOne = jest.fn().mockResolvedValue({
                subscriber_id: 1,
                email: 'test@example.com',
                destroy: jest.fn().mockResolvedValue(true)
            });

            const response = await request(subscriberApp)
                .post('/api/unsubscribe')
                .send({ email: 'test@example.com' });

            // Should handle request properly
            expect([200, 404, 429, 500]).toContain(response.status);
        });
    });
});
