# 🔧 Guide Développeur - CENADI Backend API

Guide complet pour les développeurs qui intègrent ou consomment l'API CENADI.

## 📖 Prérequis

- **Node.js**: v14+
- **npm**: v6+
- **PostgreSQL**: v12+
- **Postman** ou **cURL** (optionnel, pour tester)

## 🚀 Démarrage rapide

### 1. Installation

```bash
# Cloner le repository
git clone https://github.com/cenadi/cenadi-backend.git
cd cenadi-backend-website-final

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres
```

### 2. Configuration Base de Données

```bash
# Créer la base de données
createdb cenadi_db

# Exécuter les migrations
npm run migrate

# Charger les données de seed
npm run seed
```

### 3. Démarrage du serveur

```bash
# Mode développement (avec hot reload)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:5001`

## 📚 Structure du projet

```
src/
├── config/              # Configuration globale
│   ├── database.js      # Connexion PostgreSQL
│   ├── swagger.js       # Configuration Swagger/OpenAPI
│   ├── storage.js       # Configuration des uploads
│   └── logger.js        # Configuration Winston
├── controllers/         # Logique métier (v2 = nouvelle version)
│   ├── userController.v2.js
│   ├── newsController.v2.js
│   ├── factController.v2.js
│   └── ...
├── models/              # Modèles Sequelize
│   ├── User.js
│   ├── Article.js
│   ├── Fact.js
│   └── ...
├── routes/              # Définition des routes + Swagger JSDoc
│   ├── userRoutes.js
│   ├── newsRoutes.js
│   ├── factRoutes.js
│   └── ...
├── middleware/          # Middlewares personnalisés
│   ├── auth.js          # JWT verification
│   ├── validation.js    # Joi schemas
│   ├── rateLimiter.js   # Rate limiting
│   └── errorHandler.js  # Error handling
├── migrations/          # Migrations Sequelize
│   └── ...
├── seeders/             # Données de test
│   └── ...
└── server.js            # Point d'entrée principal
```

## 🔐 Authentification

### Générer des tokens JWT

Les tokens JWT sont générés par l'endpoint `/auth/signin` et valides 7 jours.

**Format du payload JWT**:

```javascript
{
  user_id: 1,
  username: "admin",
  email: "admin@cenadi.cm",
  role: "admin",
  iat: 1672531200,
  exp: 1673136000
}
```

### Middleware d'authentification

```javascript
const { verifyToken, adminOnly } = require("./middleware/auth");

// Sur une route protégée:
router.get("/protected", verifyToken, controller);

// Admin uniquement:
router.post("/admin-only", verifyToken, adminOnly, controller);
```

## 🎯 Créer un nouveau endpoint

### 1. Créer le modèle Sequelize

**src/models/YourModel.js**:

```javascript
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const YourModel = sequelize.define(
  "YourModel",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name_fr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Autres champs...
  },
  {
    tableName: "your_models",
    timestamps: true, // Ajoute created_at, updated_at
  }
);

module.exports = YourModel;
```

### 2. Créer le contrôleur

**src/controllers/yourModelController.v2.js**:

```javascript
const { YourModel } = require("../models");
const logger = require("../config/logger");

const getAll = async (req, res) => {
  try {
    const models = await YourModel.findAll();

    return res.status(200).json({
      success: true,
      count: models.length,
      data: models,
    });
  } catch (error) {
    logger.error("Get all error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const model = await YourModel.findByPk(id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: model,
    });
  } catch (error) {
    logger.error("Get by id error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};

const create = async (req, res) => {
  try {
    const { name_en, name_fr } = req.body;

    const model = await YourModel.create({
      name_en,
      name_fr,
      // Autres champs...
    });

    logger.info(`Created: ${model.id}`);

    return res.status(201).json({
      success: true,
      message: "Created successfully",
      data: model,
    });
  } catch (error) {
    logger.error("Create error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name_en, name_fr } = req.body;

    const model = await YourModel.findByPk(id);
    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    if (name_en !== undefined) model.name_en = name_en;
    if (name_fr !== undefined) model.name_fr = name_fr;
    // Autres champs...

    await model.save();

    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: model,
    });
  } catch (error) {
    logger.error("Update error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};

const delete_ = async (req, res) => {
  try {
    const { id } = req.params;
    const model = await YourModel.findByPk(id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    await model.destroy();

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    logger.error("Delete error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: delete_,
};
```

### 3. Créer les routes avec Swagger

**src/routes/yourModelRoutes.js**:

```javascript
const express = require("express");
const router = express.Router();
const {
  getAll,
  getById,
  create,
  update,
  delete: delete_,
} = require("../controllers/yourModelController.v2");
const { verifyToken, adminOnly } = require("../middleware/auth");

/**
 * @swagger
 * /your-models:
 *   get:
 *     summary: Récupérer tous les éléments
 *     tags: [YourModel]
 *     responses:
 *       200:
 *         description: Liste récupérée
 */
router.get("/your-models", getAll);

/**
 * @swagger
 * /your-models/{id}:
 *   get:
 *     summary: Récupérer par ID
 *     tags: [YourModel]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 */
router.get("/your-models/:id", getById);

/**
 * @swagger
 * /your-models:
 *   post:
 *     summary: Créer un élément
 *     tags: [YourModel]
 *     security:
 *       - bearerAuth: []
 */
router.post("/your-models", verifyToken, adminOnly, create);

/**
 * @swagger
 * /your-models/{id}:
 *   put:
 *     summary: Mettre à jour
 *     tags: [YourModel]
 *     security:
 *       - bearerAuth: []
 */
router.put("/your-models/:id", verifyToken, adminOnly, update);

/**
 * @swagger
 * /your-models/{id}:
 *   delete:
 *     summary: Supprimer
 *     tags: [YourModel]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/your-models/:id", verifyToken, adminOnly, delete_);

module.exports = router;
```

### 4. Enregistrer les routes

**src/server.js**:

```javascript
const yourModelRoutes = require("./routes/yourModelRoutes");
app.use("/api", yourModelRoutes);
```

## 📊 Utiliser Sequelize

### Créer une instance

```javascript
const { Article, Category, User } = require("../models");

// Créer
const article = await Article.create({
  title_en: "Title",
  title_fr: "Titre",
  // ...
});

// Lire
const articles = await Article.findAll();
const one = await Article.findByPk(1);

// Mettre à jour
article.title_en = "New Title";
await article.save();

// Supprimer
await article.destroy();
```

### Relations

```javascript
// Avec relations
const articles = await Article.findAll({
  include: [
    { model: Category, as: "category" },
    { model: User, as: "author" },
  ],
});

// articles[0].category.name_en
// articles[0].author.name
```

### Pagination

```javascript
const { page = 1, limit = 10 } = req.query;
const offset = (page - 1) * limit;

const { count, rows } = await Article.findAndCountAll({
  limit: parseInt(limit),
  offset: parseInt(offset),
  order: [["created_at", "DESC"]],
});

res.json({
  totalItems: count,
  totalPages: Math.ceil(count / limit),
  currentPage: page,
  data: rows,
});
```

## 🧪 Tester avec Postman

### Importer la collection

1. Ouvrir Postman
2. Cliquer sur "Import"
3. Sélectionner `http://localhost:5001/api-docs` ou un fichier Swagger JSON
4. Cliquer sur "Import"

### Authentification

1. Dans Postman, aller à l'onglet "Authorization"
2. Sélectionner "Bearer Token"
3. Entrer le token obtenu par `/auth/signin`

### Variables d'environnement

```json
{
  "base_url": "http://localhost:5001/api",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin_email": "admin@cenadi.cm",
  "admin_password": "SecureAdmin123"
}
```

## 🛣️ Migrations

### Créer une migration

```bash
npx sequelize-cli migration:generate --name add-new-column-to-table
```

**Migration générée**:

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("table_name", "new_column", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("table_name", "new_column");
  },
};
```

### Exécuter les migrations

```bash
# Exécuter toutes
npm run migrate

# Annuler la dernière
npx sequelize-cli db:migrate:undo
```

## 📝 Logging

```javascript
const logger = require("../config/logger");

logger.info("Info message");
logger.warn("Warning message");
logger.error("Error message", error);
logger.debug("Debug message");
```

Logs enregistrés dans `logs/` avec rotation quotidienne.

## 🔒 Validation

Utiliser Joi pour valider les données:

```javascript
const { validate, createSchema } = require("../middleware/validation");

const mySchema = Joi.object({
  name: Joi.string().required().max(100),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).max(150),
});

router.post("/create", validate(mySchema), controller);
```

## 🚨 Gestion des erreurs

Créer une classe d'erreur personnalisée:

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

throw new AppError("Resource not found", 404);
```

Middleware de gestion:

```javascript
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
  });
});
```

## 📦 Uploads de fichiers

Utiliser Multer:

```javascript
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./uploads/news/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    success: true,
    path: req.file.path,
  });
});
```

## 🐛 Debug

### Activer le mode debug

```bash
DEBUG=app:* npm run dev
```

### Logs détaillés

```javascript
// Dans .env
LOG_LEVEL = debug;
```

### Debugger avec VS Code

**.vscode/launch.json**:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/src/server.js",
      "restart": true,
      "protocol": "inspector"
    }
  ]
}
```

Ensuite: F5 pour lancer le debugger.

## 📚 Ressources

- [Sequelize Documentation](https://sequelize.org/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [Swagger/OpenAPI](https://swagger.io/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## 🤝 Contribution

1. Fork le repository
2. Créer une branche: `git checkout -b feature/my-feature`
3. Commit: `git commit -am 'Add feature'`
4. Push: `git push origin feature/my-feature`
5. Ouvrir une Pull Request

## 📝 Convention de codage

- Utiliser camelCase pour les variables et fonctions
- Utiliser PascalCase pour les classes
- Utiliser UPPER_CASE pour les constantes
- Commenter le code complexe
- Ajouter les annotations JSDoc sur les fonctions
- Ajouter les annotations Swagger sur les routes

## ✅ Checklist pour une nouvelle fonctionnalité

- [ ] Modèle Sequelize créé
- [ ] Contrôleur créé avec CRUD
- [ ] Routes créées avec Swagger JSDoc
- [ ] Middleware d'authentification appliqué si nécessaire
- [ ] Validation Joi ajoutée
- [ ] Tests unitaires écrits
- [ ] Documentation mise à jour
- [ ] Pas d'erreurs ESLint

---

**Version**: 2.0.0  
**Dernière mise à jour**: 2 janvier 2026
