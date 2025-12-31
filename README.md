# CENADI Backend API

Backend API pour le site web du CENADI (Centre National de Développement de l'Informatique), développé avec Node.js, Express et PostgreSQL.

## 🚀 Technologies

- **Node.js** - Runtime JavaScript
- **Express 5.x** - Framework web
- **PostgreSQL** - Base de données
- **JWT** - Authentification
- **Bcrypt** - Hashage des mots de passe
- **Nodemailer** - Envoi d'emails
- **Multer** - Upload de fichiers
- **EJS** - Templates d'emails

## 📋 Prérequis

- Node.js 16+
- PostgreSQL 12+
- npm ou yarn

## 🔧 Installation

1. **Cloner le repository**

```bash
git clone <repository-url>
cd cenadi-backend-website-final
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

```bash
cp .env.example .env
```

Puis éditer le fichier `.env` avec vos configurations.

4. **Créer la base de données**

```bash
psql -U postgres
CREATE DATABASE cenadi_db;
\c cenadi_db
\i db.sql
```

5. **Créer un utilisateur admin par défaut**

```sql
INSERT INTO users (username, email, name, password_hash, role, status)
VALUES ('admin', 'admin@cenadi.cm', 'Administrator',
        '$2a$10$YOUR_HASHED_PASSWORD_HERE', 'admin', 'active');
```

## 🎯 Démarrage

### Mode développement

```bash
npm run dev
```

### Mode production

```bash
npm start
```

Le serveur démarre sur `http://localhost:5001` (ou le port configuré dans `.env`)

## 📚 API Endpoints

### Authentification

- `POST /api/auth/signup` - Inscription d'un nouvel utilisateur
- `POST /api/auth/signin` - Connexion

### Utilisateurs (Authentifié)

- `GET /api/users` - Liste tous les utilisateurs (Admin uniquement)
- `GET /api/users/:userId` - Détails d'un utilisateur
- `PUT /api/users/:userId` - Modifier un utilisateur (Admin uniquement)
- `DELETE /api/users/:userId` - Supprimer un utilisateur (Admin uniquement)

### Contact

- `POST /api/contact` - Envoyer un message de contact

### Newsletter

- `POST /api/subscribe` - S'abonner à la newsletter

### Health Check

- `GET /api/health` - Vérifier l'état du serveur

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

**Headers requis pour les routes protégées:**

```
Authorization: Bearer <votre_token_jwt>
```

## 👥 Rôles & Permissions

- **Admin**: Accès complet, peut gérer tous les utilisateurs
- **Author**: Peut créer et gérer son propre contenu

## 📧 Configuration Email

Pour utiliser Gmail:

1. Activer la validation en 2 étapes sur votre compte Google
2. Générer un mot de passe d'application
3. Utiliser ce mot de passe dans `.env`

## 🔒 Sécurité

- ✅ Mots de passe hashés avec bcrypt
- ✅ JWT pour l'authentification
- ✅ Requêtes SQL paramétrées (protection SQL injection)
- ✅ CORS configuré
- ✅ Variables d'environnement pour les données sensibles

## 🗃️ Structure du Projet

```
├── src/
│   ├── config/          # Configurations (DB, SMTP)
│   ├── controllers/     # Logique métier
│   ├── middleware/      # Middleware (auth, upload)
│   ├── routes/          # Routes de l'API
│   ├── views/           # Templates EJS pour emails
│   └── server.js        # Point d'entrée
├── db.sql               # Schéma de la base de données
├── .env                 # Variables d'environnement
└── package.json         # Dépendances
```

## 🧪 Tests

```bash
npm test
```

_(À implémenter)_

## 📝 TODO

- [ ] Implémenter les contrôleurs manquants (news, projects, etc.)
- [ ] Ajouter des tests unitaires et d'intégration
- [ ] Ajouter rate limiting
- [ ] Ajouter Helmet pour la sécurité
- [ ] Configurer le middleware d'upload
- [ ] Documentation API avec Swagger
- [ ] Logging centralisé avec Winston
- [ ] Dockerisation

## 👨‍💻 Développement

### Variables d'environnement importantes

| Variable      | Description                                        |
| ------------- | -------------------------------------------------- |
| `PORT`        | Port du serveur                                    |
| `NODE_ENV`    | Environnement (development/production)             |
| `DB_HOST`     | Hôte PostgreSQL                                    |
| `DB_NAME`     | Nom de la base de données                          |
| `JWT_SECRET`  | Secret pour signer les JWT (minimum 32 caractères) |
| `CORS_ORIGIN` | Origine autorisée pour CORS                        |

## 📄 Licence

ISC

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez créer une issue ou une pull request.

## 📞 Contact

Pour toute question, contactez l'équipe CENADI.
