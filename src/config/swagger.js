const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CENADI Backend API',
      version: '1.0.0',
      description: 'API Documentation pour le backend CENADI avec Sequelize ORM',
      contact: {
        name: 'CENADI',
        url: 'https://cenadi.cm',
        email: 'info@cenadi.cm',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5001/api',
        description: 'Serveur de développement',
      },
      {
        url: 'https://api.cenadi.cm',
        description: 'Serveur de production',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token from /auth/signin endpoint',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            user_id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'john_doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            name: { type: 'string', example: 'John Doe' },
            role: { type: 'string', enum: ['admin', 'author'], example: 'author' },
            status: { type: 'string', enum: ['pending', 'active', 'suspended'], example: 'active' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            category_id: { type: 'integer', example: 1 },
            name_en: { type: 'string', example: 'News' },
            name_fr: { type: 'string', example: 'Actualités' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Article: {
          type: 'object',
          properties: {
            article_id: { type: 'integer', example: 1 },
            category_id: { type: 'integer', example: 1 },
            author_id: { type: 'integer', example: 1 },
            title_en: { type: 'string', example: 'Article Title' },
            title_fr: { type: 'string', example: 'Titre Article' },
            slug_en: { type: 'string', example: 'article-title' },
            slug_fr: { type: 'string', example: 'titre-article' },
            excerpt_en: { type: 'string' },
            excerpt_fr: { type: 'string' },
            content_en: { type: 'string' },
            content_fr: { type: 'string' },
            image_url: { type: 'string', format: 'uri' },
            is_featured: { type: 'boolean', example: false },
            published_at: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Project: {
          type: 'object',
          properties: {
            project_id: { type: 'integer', example: 1 },
            title_en: { type: 'string', example: 'Project Name' },
            title_fr: { type: 'string', example: 'Nom du Projet' },
            description_en: { type: 'string' },
            description_fr: { type: 'string' },
            link: { type: 'string', format: 'uri', example: 'cenadi.cm' },
            image_url: { type: 'string', format: 'uri' },
            posted_on: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Success message' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
