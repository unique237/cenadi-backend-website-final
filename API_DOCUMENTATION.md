# 📚 CENADI Backend API Documentation

Documentation complète de l'API REST du backend CENADI avec Sequelize ORM et PostgreSQL.

## 🚀 Accès à la Documentation

La documentation interactive Swagger est disponible à:
- **Local**: `http://localhost:5001/api-docs`
- **Production**: `https://api.cenadi.cm/api-docs`

## 📋 Table des matières

1. [Architecture](#architecture)
2. [Authentification](#authentification)
3. [Endpoints](#endpoints)
4. [Modèles de données](#modèles-de-données)
5. [Codes de réponse](#codes-de-réponse)
6. [Pagination](#pagination)
7. [Taux limite](#taux-limite)
8. [Erreurs](#erreurs)

## 🏗️ Architecture

### Stack Technologique
- **Framework**: Express.js 4.x
- **Base de données**: PostgreSQL
- **ORM**: Sequelize 6.x
- **Authentification**: JWT (Bearer Token)
- **Upload**: Multer (disque local)
- **Documentation**: Swagger/OpenAPI 3.0
- **Validation**: Joi
- **Logging**: Winston

### Ports
- **Développement**: `http://localhost:5001`
- **Production**: `https://api.cenadi.cm`

## 🔐 Authentification

L'API utilise des tokens JWT (JSON Web Tokens) pour l'authentification.

### Flux d'authentification

#### 1. Inscription (Signup)
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "name": "John Doe",
  "password": "SecurePassword123"
}
```

**Réponse (201)**:
```json
{
  "success": true,
  "message": "User created successfully. Awaiting admin approval.",
  "user": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "author",
    "status": "pending",
    "created_at": "2026-01-02T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. Connexion (Signin)
```bash
POST /api/auth/signin
Content-Type: application/json

{
  "email": "admin@cenadi.cm",
  "password": "SecureAdmin123"
}
```

**Alternative avec username**:
```json
{
  "username": "admin",
  "password": "SecureAdmin123"
}
```

**Réponse (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "user_id": 1,
    "username": "admin",
    "email": "admin@cenadi.cm",
    "name": "Administrator",
    "role": "admin",
    "status": "active",
    "created_at": "2026-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Utilisation du Token

Ajoutez le token en en-tête `Authorization`:

```bash
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 4. Déconnexion (Logout)
```bash
POST /api/auth/logout
Authorization: Bearer <token>
```

**Réponse (200)**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Permissions

- **Public**: `GET /facts`, `GET /projects`, `GET /news`, etc.
- **Admin**: POST, PUT, DELETE sur tous les endpoints
- **Author**: Can create/update own articles
- **Authenticated**: Certains endpoints nécessitent une authentification

## 📡 Endpoints

### Authentification

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/auth/signup` | Inscription | Non |
| POST | `/auth/signin` | Connexion | Non |
| POST | `/auth/logout` | Déconnexion | Oui |

### Utilisateurs

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/users` | Tous les utilisateurs | Admin |
| GET | `/users/{id}` | Détails utilisateur | Admin |
| POST | `/users` | Créer utilisateur | Admin |
| PUT | `/users/{id}` | Mettre à jour | Admin |
| DELETE | `/users/{id}` | Supprimer | Admin |

### Catégories

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/categories` | Toutes les catégories | Non |
| GET | `/categories/{id}` | Détails catégorie | Non |
| POST | `/categories` | Créer | Admin |
| PUT | `/categories/{id}` | Mettre à jour | Admin |
| DELETE | `/categories/{id}` | Supprimer | Admin |

### Articles (News)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/news` | Tous les articles | Non |
| GET | `/news/{id}` | Détails article | Non |
| POST | `/news` | Créer | Admin |
| PUT | `/news/{id}` | Mettre à jour | Admin |
| DELETE | `/news/{id}` | Supprimer | Admin |

**Paramètres de filtrage (GET /news)**:
- `page`: Numéro de page (défaut: 1)
- `limit`: Éléments par page (défaut: 10)
- `category_id`: Filtrer par catégorie
- `is_featured`: Filtrer par vedette (true/false)
- `author_id`: Filtrer par auteur

Exemple:
```bash
GET /api/news?page=2&limit=20&category_id=1&is_featured=true
```

### Projets

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/projects` | Tous les projets | Non |
| GET | `/projects/{id}` | Détails projet | Non |
| POST | `/projects` | Créer | Admin |
| PUT | `/projects/{id}` | Mettre à jour | Admin |
| DELETE | `/projects/{id}` | Supprimer | Admin |

### Faits et Statistiques

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/facts` | Tous les faits | Non |
| GET | `/facts/{id}` | Détails fait | Non |
| POST | `/facts` | Créer | Admin |
| PUT | `/facts/{id}` | Mettre à jour | Admin |
| DELETE | `/facts/{id}` | Supprimer | Admin |

### Personnel (Staff)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/staffs` | Tous les membres | Non |
| GET | `/staffs/{id}` | Détails membre | Non |
| POST | `/staffs` | Créer | Admin |
| PUT | `/staffs/{id}` | Mettre à jour | Admin |
| DELETE | `/staffs/{id}` | Supprimer | Admin |

### Partenaires

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/partners` | Tous les partenaires | Non |
| GET | `/partners/{id}` | Détails partenaire | Non |
| POST | `/partners` | Créer | Admin |
| PUT | `/partners/{id}` | Mettre à jour | Admin |
| DELETE | `/partners/{id}` | Supprimer | Admin |

### Newsletters

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/newsletters` | Toutes les newsletters | Non |
| GET | `/newsletters/{id}` | Détails newsletter | Non |
| POST | `/newsletters` | Créer | Admin |
| PUT | `/newsletters/{id}` | Mettre à jour | Admin |
| DELETE | `/newsletters/{id}` | Supprimer | Admin |

### Messages (Directeur/Ministre)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/director-messages` | Messages directeur | Non |
| GET | `/minister-messages` | Messages ministre | Non |
| POST | `/director-messages` | Créer | Admin |
| PUT | `/director-messages/{id}` | Mettre à jour | Admin |
| DELETE | `/director-messages/{id}` | Supprimer | Admin |

### E-Books

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/ebooks` | Tous les e-books | Non |
| GET | `/ebooks/{id}` | Détails e-book | Non |
| POST | `/ebooks` | Créer | Admin |
| PUT | `/ebooks/{id}` | Mettre à jour | Admin |
| DELETE | `/ebooks/{id}` | Supprimer | Admin |

### Uploads de fichiers

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/upload/{endpoint}` | Upload fichier | Oui |
| GET | `/uploads/{path}` | Télécharger fichier | Non |

**Endpoints disponibles pour upload**:
- `news`: Articles
- `projects`: Projets
- `assets`: Ressources générales
- `partners`: Logos partenaires
- `newsletters`: Images newsletters
- `staffs`: Photos personnel
- `ebooks`: Couvertures e-books

Exemple:
```bash
POST /api/upload/news
Content-Type: multipart/form-data
Authorization: Bearer <token>

[image file]
```

**Réponse**:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "/uploads/news/abc123-1234567890.jpg",
    "filename": "abc123-1234567890.jpg",
    "size": 125000
  }
}
```

### Contact et Abonnement

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/contact` | Formulaire de contact | Non |
| POST | `/subscribe` | S'abonner à la newsletter | Non |

## 📊 Modèles de données

### User (Utilisateur)

```javascript
{
  user_id: INTEGER PRIMARY KEY AUTO_INCREMENT,
  username: STRING UNIQUE NOT NULL,
  email: STRING UNIQUE NOT NULL,
  name: STRING NOT NULL,
  password_hash: STRING NOT NULL,
  role: ENUM('admin', 'author') DEFAULT 'author',
  status: ENUM('pending', 'active', 'suspended') DEFAULT 'pending',
  created_at: DATETIME,
  updated_at: DATETIME
}
```

### Category (Catégorie)

```javascript
{
  category_id: INTEGER PRIMARY KEY AUTO_INCREMENT,
  name_en: STRING NOT NULL,
  name_fr: STRING NOT NULL,
  created_at: DATETIME,
  updated_at: DATETIME
}
```

### Article (Article/Actualité)

```javascript
{
  article_id: INTEGER PRIMARY KEY AUTO_INCREMENT,
  category_id: INTEGER FOREIGN KEY,
  author_id: INTEGER FOREIGN KEY,
  title_en: STRING NOT NULL,
  title_fr: STRING NOT NULL,
  slug_en: STRING UNIQUE,
  slug_fr: STRING UNIQUE,
  excerpt_en: TEXT,
  excerpt_fr: TEXT,
  content_en: LONGTEXT NOT NULL,
  content_fr: LONGTEXT NOT NULL,
  image_url: STRING,
  is_featured: BOOLEAN DEFAULT FALSE,
  published_at: DATETIME,
  created_at: DATETIME,
  updated_at: DATETIME
}
```

### Project (Projet)

```javascript
{
  project_id: INTEGER PRIMARY KEY AUTO_INCREMENT,
  title_en: STRING NOT NULL,
  title_fr: STRING NOT NULL,
  description_en: TEXT NOT NULL,
  description_fr: TEXT NOT NULL,
  link: STRING,
  image_url: STRING,
  posted_on: DATETIME,
  created_at: DATETIME,
  updated_at: DATETIME
}
```

### Fact (Fait/Statistique)

```javascript
{
  fact_id: INTEGER PRIMARY KEY AUTO_INCREMENT,
  name_en: STRING,
  name_fr: STRING,
  content_en: TEXT NOT NULL,
  content_fr: TEXT NOT NULL,
  description_en: TEXT,
  description_fr: TEXT,
  icon_url: STRING,
  posted_on: DATETIME,
  created_at: DATETIME,
  updated_at: DATETIME
}
```

## 📝 Codes de réponse

### Codes de succès

| Code | Signification |
|------|---------------|
| 200 | OK - Requête réussie |
| 201 | Created - Ressource créée |
| 204 | No Content - Succès sans contenu |

### Codes d'erreur client

| Code | Signification | Exemple |
|------|---------------|---------|
| 400 | Bad Request - Données invalides | `{ "success": false, "message": "Content required" }` |
| 401 | Unauthorized - Non authentifié | `{ "success": false, "message": "Missing token" }` |
| 403 | Forbidden - Permissions insuffisantes | `{ "success": false, "message": "Admin access required" }` |
| 404 | Not Found - Ressource non trouvée | `{ "success": false, "message": "Article not found" }` |
| 409 | Conflict - Ressource existe déjà | `{ "success": false, "message": "Email already exists" }` |
| 429 | Too Many Requests - Taux limite dépassé | Rate limiting actif |

### Codes d'erreur serveur

| Code | Signification |
|------|---------------|
| 500 | Internal Server Error - Erreur serveur |
| 503 | Service Unavailable - Service indisponible |

## 📄 Pagination

Les endpoints listant les ressources supportent la pagination:

```bash
GET /api/news?page=2&limit=20
```

**Réponse**:
```json
{
  "success": true,
  "count": 20,
  "totalItems": 150,
  "totalPages": 8,
  "currentPage": 2,
  "articles": [...]
}
```

Paramètres:
- `page`: Numéro de page (défaut: 1)
- `limit`: Éléments par page (défaut: 10, max: 100)

## ⏱️ Taux limite

La plupart des endpoints sont protégés par un taux limite pour éviter les abus.

### Limites par défaut

- **Authentification** (`/auth/*`): 5 requêtes/minute par IP
- **Autres endpoints**: 1000 requêtes/60 secondes par IP
- **Localhost**: Pas de limite (pour développement)

**Réponse 429**:
```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

En-têtes de réponse:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1672531200
```

## ❌ Gestion des erreurs

### Format d'erreur standard

```json
{
  "success": false,
  "message": "Description de l'erreur",
  "error": "Détails techniques optionnels",
  "statusCode": 400
}
```

### Erreurs courantes

#### Email/Username déjà existant
```json
{
  "success": false,
  "message": "Email already exists or username is taken"
}
```

#### Identifiants invalides
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### Données manquantes
```json
{
  "success": false,
  "message": "Validation error",
  "details": {
    "content_en": "Content is required",
    "content_fr": "Contenu requis"
  }
}
```

#### Non authentifié
```json
{
  "success": false,
  "message": "Missing or invalid token"
}
```

#### Accès refusé
```json
{
  "success": false,
  "message": "Admin access required"
}
```

## 🔑 Credentials de test

Pour tester l'API en développement:

```json
{
  "email": "admin@cenadi.cm",
  "password": "SecureAdmin123"
}
```

Ou avec username:
```json
{
  "username": "admin",
  "password": "SecureAdmin123"
}
```

## 📁 Structure des uploads

Les fichiers uploadés sont organisés par endpoint:

```
/uploads/
├── news/
│   ├── abc123-timestamp-id.jpg
│   └── ...
├── projects/
│   └── ...
├── assets/
│   └── ...
├── partners/
│   └── ...
├── newsletters/
│   └── ...
├── staffs/
│   └── ...
└── ebooks/
    └── ...
```

## 🛠️ Développement

### Installation

```bash
cd cenadi-backend-website-final
npm install
```

### Variables d'environnement

```bash
# .env
NODE_ENV=development
PORT=5001
DATABASE_URL=postgresql://user:password@localhost:5432/cenadi_db
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

### Démarrage

```bash
npm run dev
```

### Tests

```bash
npm run test
```

## 📚 Ressources supplémentaires

- **OpenAPI Spec**: `http://localhost:5001/api-docs`
- **Swagger UI**: `http://localhost:5001/api-docs`
- **GitHub Repo**: [Lien du repository]
- **Issues**: Signaler les bugs

## 📞 Support

Pour toute question ou problème:
- Email: `info@cenadi.cm`
- Slack: `#api-support`
- GitHub Issues: Issues

---

**Version**: 2.0.0  
**Dernière mise à jour**: 2 janvier 2026  
**Mainteneur**: CENADI Team
