# 🌍 CENADI Backend API

API Backend complète pour le site web du CENADI (Centre d'Apprentissage pour le Numérique et le Développement Informatique) développée avec **Express.js**, **Sequelize ORM** et **PostgreSQL**.

## 📋 Table des matières

- [Démarrage rapide](#-démarrage-rapide)
- [Architecture](#-architecture)
- [Structure du projet](#-structure-du-projet)
- [Documentation](#-documentation)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Endpoints API](#-endpoints-api)
- [Authentification](#-authentification)
- [Testing](#-testing)
- [Déploiement](#-déploiement)
- [Support](#-support)

---

## 🚀 Démarrage rapide

### Prérequis
- Node.js v18+
- PostgreSQL v12+
- npm ou yarn

### Installation rapide

```bash
# 1. Cloner le repo
git clone <repo-url>
cd cenadi-backend-website-final

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditez le fichier .env avec vos paramètres

# 4. Initialiser la base de données
npm run migrate
npm run seed

# 5. Démarrer le serveur
npm run dev
```

Le serveur démarre sur `http://localhost:5001`

Documentation API disponible à: `http://localhost:5001/api-docs`

---

## 🏗️ Architecture

### Stack Technique

```
Frontend (Vite React)          Dashboard Admin (React + TypeScript)
         ↓                              ↓
    API REST                    API REST
         ↓                              ↓
   Express.js (Port 5001) ←─────────────
         ↓
  Sequelize ORM
         ↓
  PostgreSQL (cenadi_db)
```

### Couches applicatives

1. **Routes** (`src/routes/`) - Points d'entrée API
2. **Contrôleurs** (`src/controllers/`) - Logique métier
3. **Modèles** (`src/models/`) - Entités Sequelize
4. **Middleware** (`src/middleware/`) - Authentification, validation, uploads
5. **Configuration** (`src/config/`) - BD, Swagger, stockage

---

## 📁 Structure du projet

```
cenadi-backend-website-final/
│
├── 📄 README.md                 # Ce fichier
├── 📄 package.json             # Dépendances Node.js
├── 📄 .env.example             # Variables d'environnement (template)
├── 📄 .eslintrc.json           # Configuration ESLint
├── 📄 jest.config.js           # Configuration Jest
│
├── 📁 src/                      # Code source principal
│   ├── server.js              # Point d'entrée Express
│   │
│   ├── config/                # Configuration
│   │   ├── database.js        # Connexion PostgreSQL
│   │   ├── swagger.js         # Config OpenAPI 3.0
│   │   └── storage.js         # Config Multer uploads
│   │
│   ├── models/                # Modèles Sequelize
│   │   ├── User.js
│   │   ├── Article.js
│   │   ├── Category.js
│   │   ├── Project.js
│   │   ├── Fact.js
│   │   ├── Staff.js
│   │   ├── Partner.js
│   │   ├── Newsletter.js
│   │   ├── DirectorMessage.js
│   │   ├── FinanceMinisterMessage.js
│   │   ├── EBook.js
│   │   ├── Asset.js
│   │   └── Subscriber.js
│   │
│   ├── routes/                # Routes API
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── newsRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── factRoutes.js
│   │   ├── staffRoutes.js
│   │   ├── partnerRoutes.js
│   │   ├── newsletterRoutes.js
│   │   ├── directorMessageRoutes.js
│   │   ├── financeMinisterMessageRoutes.js
│   │   ├── ebookRoutes.js
│   │   ├── uploadRoutes.js
│   │   ├── contactRoutes.js
│   │   └── subcribeRoutes.js
│   │
│   ├── controllers/           # Logique métier
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── newsController.v2.js
│   │   ├── projectController.v2.js
│   │   ├── factController.v2.js
│   │   ├── staffController.v2.js
│   │   ├── partnerController.v2.js
│   │   ├── newsletterController.js
│   │   ├── ebookController.v2.js
│   │   └── ...
│   │
│   ├── middleware/            # Middlewares Express
│   │   ├── auth.js           # JWT authentification
│   │   ├── upload.js         # Multer configuration
│   │   └── errorHandler.js   # Gestion d'erreurs
│   │
│   ├── seeders/              # Données initiales
│   │   ├── 001_users.js
│   │   ├── 002_categories.js
│   │   └── ...
│   │
│   └── __tests__/            # Tests Jest
│       ├── auth.test.js
│       ├── facts.test.js
│       └── ...
│
├── 📁 migrations/            # Migrations Sequelize
│   └── 20251231-add-subscribers-email-index.js
│
├── 📁 docs/                  # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── DEVELOPER_GUIDE.md
│   ├── SWAGGER_GUIDE.md
│   ├── DOCUMENTATION_README.md
│   └── DOCUMENTATION_UPDATE_SUMMARY.md
│
├── 📁 uploads/              # Fichiers uploadés (ignoré par Git)
│   ├── partners/
│   ├── news/
│   ├── projects/
│   ├── staff/
│   ├── ebooks/
│   └── ...
│
├── 📁 logs/                 # Fichiers de log
│   └── combined.log
│
└── 📁 coverage/             # Couverture des tests
    ├── lcov.info
    └── lcov-report/
```

---

## 📚 Documentation

### 📖 Accès à la documentation

| Document | Contenu | Audience |
|----------|---------|----------|
| [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | Référence complète de tous les endpoints | Frontend devs, QA, API consumers |
| [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) | Guide setup, patterns, et best practices | Backend devs, nouveaux contributeurs |
| [SWAGGER_GUIDE.md](docs/SWAGGER_GUIDE.md) | Guide maintenance Swagger/OpenAPI 3.0 | Documenters, API maintainers |
| [DOCUMENTATION_README.md](docs/DOCUMENTATION_README.md) | Point d'accès rapide à la doc | Tous les utilisateurs |
| [DOCUMENTATION_UPDATE_SUMMARY.md](docs/DOCUMENTATION_UPDATE_SUMMARY.md) | Statistiques et changelog | Project managers |

### 🔍 Swagger UI

Accédez à l'interface interactive Swagger:
```
http://localhost:5001/api-docs
```

---

## 🔧 Installation

### Étape 1: Cloner le repository

```bash
git clone https://github.com/cenadi/cenadi-backend-website-final.git
cd cenadi-backend-website-final
```

### Étape 2: Installer les dépendances

```bash
npm install
```

### Étape 3: Configurer l'environnement

```bash
cp .env.example .env
```

Éditez `.env` avec vos paramètres:

```env
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=cenadi_db

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Environnement
NODE_ENV=development
PORT=5001
```

### Étape 4: Initialiser la base de données

```bash
# Créer la base de données
createdb cenadi_db

# Exécuter les migrations
npm run migrate

# Charger les données initiales
npm run seed
```

### Étape 5: Démarrer le serveur

```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm run start
```

---

## 💻 Utilisation

### Commands npm

```bash
# Démarrage
npm run dev              # Développement (auto-reload)
npm start               # Production
npm run dev:no-nodemon  # Dev sans auto-reload

# Testing
npm test                # Exécuter tous les tests
npm run test:watch      # Mode watch
npm run coverage        # Coverage report

# Linting
npm run lint            # Vérifier le code
npm run lint:fix        # Corriger les problèmes

# Base de données
npm run migrate         # Appliquer les migrations
npm run seed           # Charger les données initiales
npm run migrate:undo   # Annuler dernière migration

# Logs
npm run logs           # Afficher les logs
```

---

## 🔌 Endpoints API

### Authentification
```
POST   /auth/signin              # Connexion utilisateur
POST   /auth/signup              # Inscription
POST   /auth/logout              # Déconnexion
```

### Contenu
```
GET    /news                     # Lister les articles
POST   /news                     # Créer un article
GET    /news/:id                 # Détails d'un article
PUT    /news/:id                 # Modifier article
DELETE /news/:id                 # Supprimer article

GET    /facts                    # Lister les faits
POST   /facts                    # Créer un fait
```

### Gestion
```
GET    /categories               # Catégories
GET    /projects                 # Projets
GET    /staffs                   # Personnel
GET    /partners                 # Partenaires
GET    /newsletters              # Newsletters
GET    /ebooks                   # E-books
GET    /director-messages        # Messages directeur
GET    /finance-minister-messages # Messages ministre
```

### Uploads
```
POST   /upload/news               # Upload image article
POST   /upload/projects           # Upload image projet
POST   /upload/partners           # Upload logo partenaire
```

**Documentation complète**: [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

---

## 🔐 Authentification

### JWT Bearer Token

Tous les endpoints protégés nécessitent un token JWT:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Credentials de test

```
Email:    admin@cenadi.cm
Password: SecureAdmin123
```

Ou utilisez le nom d'utilisateur:
```
Username: admin
Password: SecureAdmin123
```

---

## 🧪 Testing

### Exécuter les tests

```bash
# Tous les tests
npm test

# Mode watch (re-run on change)
npm run test:watch

# Coverage report
npm run coverage
```

### Avec Postman

1. Importez la collection Swagger:
   ```
   http://localhost:5001/api-docs
   ```

2. Obtenez un token via:
   ```
   POST /auth/signin
   Body: { "email": "admin@cenadi.cm", "password": "SecureAdmin123" }
   ```

3. Utilisez le token dans les headers pour les requêtes protégées

---

## 🚢 Déploiement

### Production Checklist

- [ ] `.env` configuré avec variables de production
- [ ] `NODE_ENV=production`
- [ ] `PORT=5001` ou configuré pour l'environnement
- [ ] Base de données PostgreSQL configurée
- [ ] SSL/HTTPS activé
- [ ] CORS configuré pour les domaines autorisés
- [ ] Rate limiting activé
- [ ] Logs configurés
- [ ] Tests passent avec succès

### Déployer sur Heroku

```bash
# 1. Créer l'app Heroku
heroku create cenadi-api

# 2. Configurer les env vars
heroku config:set DB_HOST=...
heroku config:set JWT_SECRET=...

# 3. Pousser le code
git push heroku main

# 4. Exécuter les migrations
heroku run npm run migrate
heroku run npm run seed
```

### Déployer sur Azure

Consultez [docs/CLOUD_MIGRATION_PLAN.md](docs/CLOUD_MIGRATION_PLAN.md)

---

## 📊 Statistiques

| Métrique | Valeur |
|----------|--------|
| Routes API | 40+ |
| Modèles Sequelize | 14 |
| Schémas OpenAPI | 16 |
| Tags Swagger | 11 |
| Tests | 25+ |
| Couverture | ~80% |
| Lignes de code | 5000+ |

---

## 🤝 Contribution

### Ajouter un nouvel endpoint

1. Créez le modèle dans `src/models/`
2. Créez le contrôleur dans `src/controllers/`
3. Créez les routes dans `src/routes/`
4. Documentez avec annotations Swagger
5. Ajoutez les tests dans `src/__tests__/`

Consultez [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) pour le guide détaillé.

---

## 📞 Support

### Ressources

- 📖 [Documentation Complète](docs/DOCUMENTATION_README.md)
- 🔗 [API Reference](docs/API_DOCUMENTATION.md)
- 👨‍💻 [Developer Guide](docs/DEVELOPER_GUIDE.md)
- 📝 [Swagger/OpenAPI Guide](docs/SWAGGER_GUIDE.md)

### Contacts

- **Email Support**: info@cenadi.cm
- **Documentation**: https://cenadi.cm/docs
- **GitHub Issues**: [Report a bug](https://github.com/cenadi/cenadi-backend-website-final/issues)

---

## 📄 License

MIT © 2024 CENADI

---

## 🎯 Roadmap

- [ ] GraphQL support
- [ ] WebSocket notifications
- [ ] Advanced caching
- [ ] Analytics dashboard
- [ ] Admin panel backend
- [ ] Multi-language support enhancement

---

**Dernière mise à jour**: 2 janvier 2026

**Mainteneur**: CENADI Development Team

**Questions?** Consultez la [documentation complète](docs/DOCUMENTATION_README.md) ou créez une [issue](https://github.com/cenadi/cenadi-backend-website-final/issues)
