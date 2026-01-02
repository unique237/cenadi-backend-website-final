const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CENADI Backend API',
      version: '2.0.0',
      description: 'API Documentation complète pour le backend CENADI avec Sequelize ORM et PostgreSQL',
      contact: {
        name: 'CENADI Support',
        url: 'https://cenadi.cm',
        email: 'info@cenadi.cm',
      },
      license: {
        name: 'MIT',
      },
      'x-logo': {
        url: 'https://cenadi.cm/logo.png',
        altText: 'CENADI Logo'
      }
    },
    'externalDocs': {
      description: 'Lire la documentation complète',
      url: 'https://cenadi.cm/docs'
    },
    servers: [
      {
        url: 'http://localhost:5001/api',
        description: 'Serveur de développement local',
        variables: {
          port: {
            default: '5001'
          }
        }
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
          description: 'JWT Bearer token from /auth/signin endpoint. Format: Bearer <token>',
        },
      },
      schemas: {
        // ============ UTILISATEURS ============
        User: {
          type: 'object',
          properties: {
            user_id: { type: 'integer', example: 1, description: 'Identifiant unique' },
            username: { type: 'string', example: 'admin', description: 'Nom d\'utilisateur unique' },
            email: { type: 'string', format: 'email', example: 'admin@cenadi.cm', description: 'Email unique' },
            name: { type: 'string', example: 'Administrateur CENADI', description: 'Nom complet' },
            password_hash: { type: 'string', description: 'Hash bcrypt du mot de passe (ne jamais exposer)' },
            role: { type: 'string', enum: ['admin', 'author'], example: 'admin', description: 'Rôle utilisateur' },
            status: { type: 'string', enum: ['pending', 'active', 'suspended'], example: 'active', description: 'Statut du compte' },
            created_at: { type: 'string', format: 'date-time', description: 'Date de création' },
            updated_at: { type: 'string', format: 'date-time', description: 'Dernière modification' },
          },
          required: ['user_id', 'username', 'email', 'name', 'role', 'status']
        },

        // ============ CATÉGORIES ============
        Category: {
          type: 'object',
          properties: {
            category_id: { type: 'integer', example: 1, description: 'Identifiant unique' },
            name_en: { type: 'string', example: 'News & Updates', description: 'Nom en anglais' },
            name_fr: { type: 'string', example: 'Actualités & Mises à Jour', description: 'Nom en français' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
          required: ['category_id', 'name_en', 'name_fr']
        },

        // ============ ARTICLES ============
        Article: {
          type: 'object',
          properties: {
            article_id: { type: 'integer', example: 1 },
            category_id: { type: 'integer', example: 1, description: 'Référence vers Category' },
            author_id: { type: 'integer', example: 1, description: 'Référence vers User' },
            title_en: { type: 'string', example: 'Welcome to CENADI', description: 'Titre en anglais' },
            title_fr: { type: 'string', example: 'Bienvenue au CENADI', description: 'Titre en français' },
            slug_en: { type: 'string', example: 'welcome-to-cenadi' },
            slug_fr: { type: 'string', example: 'bienvenue-au-cenadi' },
            excerpt_en: { type: 'string', description: 'Résumé en anglais' },
            excerpt_fr: { type: 'string', description: 'Résumé en français' },
            content_en: { type: 'string', description: 'Contenu complet en anglais' },
            content_fr: { type: 'string', description: 'Contenu complet en français' },
            image_url: { type: 'string', format: 'uri', example: '/uploads/news/article1.jpg' },
            is_featured: { type: 'boolean', example: false, description: 'Article en vedette' },
            published_at: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
          required: ['article_id', 'category_id', 'author_id', 'title_en', 'title_fr', 'content_en', 'content_fr']
        },

        // ============ PROJETS ============
        Project: {
          type: 'object',
          properties: {
            project_id: { type: 'integer', example: 1 },
            title_en: { type: 'string', example: 'Renewable Energy Project' },
            title_fr: { type: 'string', example: 'Projet Énergie Renouvelable' },
            description_en: { type: 'string', description: 'Description complète en anglais' },
            description_fr: { type: 'string', description: 'Description complète en français' },
            link: { type: 'string', format: 'uri', example: 'https://cenadi.cm/projects/renewable' },
            image_url: { type: 'string', format: 'uri' },
            posted_on: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
          required: ['project_id', 'title_en', 'title_fr', 'description_en', 'description_fr']
        },

        // ============ FAITS & STATISTIQUES ============
        Fact: {
          type: 'object',
          properties: {
            fact_id: { type: 'integer', example: 1 },
            name_en: { type: 'string', example: '500+', description: 'Titre/chiffre en anglais' },
            name_fr: { type: 'string', example: '500+', description: 'Titre/chiffre en français' },
            content_en: { type: 'string', example: 'Active Partners Worldwide' },
            content_fr: { type: 'string', example: 'Partenaires Actifs Mondiaux' },
            description_en: { type: 'string', example: 'Description supplémentaire en anglais' },
            description_fr: { type: 'string', example: 'Description supplémentaire en français' },
            icon_url: { type: 'string', format: 'uri' },
            posted_on: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
          required: ['fact_id', 'content_en', 'content_fr']
        },

        // ============ STAFF ============
        Staff: {
          type: 'object',
          properties: {
            staff_id: { type: 'integer', example: 1 },
            firstname: { type: 'string', example: 'Jean' },
            lastname: { type: 'string', example: 'Dupont' },
            email: { type: 'string', format: 'email', example: 'jean.dupont@cenadi.cm' },
            phone: { type: 'string', example: '+237 6XX XXX XXX' },
            function: { type: 'string', example: 'Directeur Général' },
            biography: { type: 'string', description: 'Biographie du personnel' },
            image_url: { type: 'string', format: 'uri' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
          required: ['staff_id', 'firstname', 'lastname', 'email', 'function']
        },

        // ============ PARTENAIRES ============
        Partner: {
          type: 'object',
          properties: {
            partner_id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Organisation Partner Inc.' },
            description: { type: 'string', description: 'Description du partenaire' },
            logo_url: { type: 'string', format: 'uri', description: 'URL du logo' },
            website: { type: 'string', format: 'uri', example: 'https://partner.com' },
            contact_email: { type: 'string', format: 'email' },
            contact_phone: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
          required: ['partner_id', 'name', 'logo_url']
        },

        // ============ NEWSLETTERS ============
        Newsletter: {
          type: 'object',
          properties: {
            newsletter_id: { type: 'integer', example: 1 },
            subject_en: { type: 'string', example: 'Monthly Newsletter' },
            subject_fr: { type: 'string', example: 'Infolettre Mensuelle' },
            content_en: { type: 'string', description: 'Contenu de la newsletter en anglais' },
            content_fr: { type: 'string', description: 'Contenu de la newsletter en français' },
            image_url: { type: 'string', format: 'uri' },
            published_at: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
          required: ['newsletter_id', 'subject_en', 'subject_fr', 'content_en', 'content_fr']
        },

        // ============ MESSAGES ============
        DirectorMessage: {
          type: 'object',
          properties: {
            director_message_id: { type: 'integer', example: 1 },
            title_en: { type: 'string', example: 'Director\'s Message' },
            title_fr: { type: 'string', example: 'Message du Directeur' },
            content_en: { type: 'string' },
            content_fr: { type: 'string' },
            image_url: { type: 'string', format: 'uri' },
            published_at: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
          required: ['director_message_id', 'title_en', 'title_fr', 'content_en', 'content_fr']
        },

        FinanceMinisterMessage: {
          type: 'object',
          properties: {
            minister_message_id: { type: 'integer', example: 1 },
            title_en: { type: 'string', example: 'Minister\'s Statement' },
            title_fr: { type: 'string', example: 'Déclaration du Ministre' },
            content_en: { type: 'string' },
            content_fr: { type: 'string' },
            image_url: { type: 'string', format: 'uri' },
            published_at: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
          required: ['minister_message_id', 'title_en', 'title_fr', 'content_en', 'content_fr']
        },

        // ============ E-BOOKS ============
        EBook: {
          type: 'object',
          properties: {
            ebook_id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Energy Efficiency Guide' },
            description: { type: 'string' },
            author: { type: 'string', example: 'CENADI Team' },
            file_url: { type: 'string', format: 'uri', description: 'URL du PDF' },
            cover_image_url: { type: 'string', format: 'uri' },
            published_at: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
          required: ['ebook_id', 'title', 'file_url']
        },

        // ============ ASSETS (Fichiers) ============
        Asset: {
          type: 'object',
          properties: {
            asset_id: { type: 'integer', example: 1 },
            filename: { type: 'string', example: 'logo.png' },
            original_name: { type: 'string', example: 'logo.png' },
            file_path: { type: 'string', example: '/uploads/assets/logo.png' },
            file_size: { type: 'integer', example: 125000, description: 'Taille en bytes' },
            mime_type: { type: 'string', example: 'image/png' },
            uploader_id: { type: 'integer', description: 'Référence vers User' },
            uploaded_at: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
          required: ['asset_id', 'filename', 'file_path', 'mime_type']
        },

        // ============ RÉPONSES ============
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Erreur lors du traitement' },
            error: { type: 'string', description: 'Détails supplémentaires de l\'erreur' },
          },
        },

        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Opération réussie' },
          },
        },

        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            count: { type: 'integer', example: 10 },
            totalItems: { type: 'integer', example: 100 },
            totalPages: { type: 'integer', example: 10 },
            currentPage: { type: 'integer', example: 1 },
            data: { type: 'array', items: { type: 'object' } },
          },
        },

        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Connexion réussie' },
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: 'Authentication', description: 'Endpoints d\'authentification et autorisation' },
      { name: 'Users', description: 'Gestion des utilisateurs' },
      { name: 'Categories', description: 'Gestion des catégories d\'articles' },
      { name: 'News', description: 'Gestion des articles et actualités' },
      { name: 'Projects', description: 'Gestion des projets' },
      { name: 'Facts', description: 'Gestion des faits et statistiques' },
      { name: 'Staff', description: 'Gestion du personnel' },
      { name: 'Partners', description: 'Gestion des partenaires' },
      { name: 'Newsletters', description: 'Gestion des newsletters' },
      { name: 'Messages', description: 'Messages des directeurs/ministres' },
      { name: 'EBooks', description: 'Gestion des e-books' },
      { name: 'Uploads', description: 'Téléchargement et gestion de fichiers' },
      { name: 'Contact', description: 'Formulaires de contact' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
