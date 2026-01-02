# 🔧 Middleware

Ce dossier contient tous les middlewares Express pour l'authentification, validation, et gestion des fichiers.

## 📁 Middlewares disponibles

```
middleware/
├── auth.js              # JWT authentification et autorisations
├── upload.js            # Multer pour les uploads de fichiers
└── errorHandler.js      # Gestion centralisée des erreurs
```

## 🔐 auth.js - Authentification JWT

### `verifyToken`

Valide le JWT Bearer token et attache l'utilisateur à la requête.

```javascript
// Usage dans les routes
router.get("/protected", verifyToken, handler);

// Dans le handler
exports.handler = (req, res) => {
  console.log(req.user); // { user_id, username, email, role }
};
```

**Format du token**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### `adminOnly`

Restreint l'accès aux administrateurs uniquement.

```javascript
// Usage
router.delete("/articles/:id", verifyToken, adminOnly, deleteArticle);

// Si l'utilisateur n'est pas admin → 403 Forbidden
```

### `optionalAuth`

Authentification optionnelle (Ne bloque pas si pas de token).

```javascript
router.get("/articles", optionalAuth, getArticles);
// `req.user` sera undefined si pas de token
```

### Flux d'authentification

```javascript
// 1. Signup
POST /auth/signup
Body: { username, email, password, name }
// Retourne: { success, message, user, token }

// 2. Signin
POST /auth/signin
Body: { email/username, password }
// Retourne: { success, message, user, token }

// 3. Utiliser le token
GET /api/protected
Header: Authorization: Bearer {token}
// Retourne: Les données protégées
```

## 📤 upload.js - Upload de fichiers

Configuration Multer pour les uploads.

### Structure des uploads

```javascript
uploads/
├── partners/      # Logos partenaires
├── news/          # Images articles
├── projects/      # Images projets
├── staff/         # Photos personnel
├── ebooks/        # Fichiers PDF
└── assets/        # Autres ressources
```

### Utilisation

```javascript
// Dans les routes
router.post("/upload/news", verifyToken, upload.single("image"), handler);

// Dans le handler
exports.handler = (req, res) => {
  console.log(req.file); // { fieldname, filename, path, size, mimetype }
  const fileUrl = `/uploads/news/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
};
```

### Configuration

- **Taille max**: 10 MB
- **Formats**: JPEG, PNG, GIF, WebP
- **Stockage**: Disque local `/uploads/`

## ⚠️ errorHandler.js - Gestion d'erreurs

Middleware centralisé pour capturer et standardiser les erreurs.

```javascript
// Les erreurs sont attrapées et converties au format standard
{
  success: false,
  message: 'Description de l\'erreur',
  statusCode: 500,
  error: process.env.NODE_ENV === 'development' ? error.stack : undefined
}
```

## 📋 Chaîne de middleware typique

```javascript
// Route avec authentification et validation
router.post(
  "/articles",
  verifyToken, // Vérifier le token
  adminOnly, // Vérifier le rôle admin
  upload.single("image"), // Optionnel: upload fichier
  validate(schema), // Valider les données
  createArticle // Handler
);
```

## 🔑 Variables d'environnement requises

```env
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

## 🛡️ Bonnes pratiques

### ✅ À faire

```javascript
// Vérifier les rôles
if (req.user.role !== "admin") {
  return res.status(403).json({ error: "Admin only" });
}

// Logger les erreurs d'auth
console.error(`Auth failed for ${req.user?.email}`);

// Nettoyer les données sensibles
delete user.password_hash;
```

### ❌ À éviter

```javascript
// Ne pas exposer les tokens dans les logs
console.log("Token:", req.headers.authorization);

// Ne pas stocker les mots de passe en clair
user.password = req.body.password;

// Ne pas faire confiance aux IDs du client
const user = await User.findByPk(req.body.user_id); // ❌ Utiliser req.user
```

## 🔄 Flow complet d'authentification

```
1. Client envoie credentials
   POST /auth/signin

2. Backend vérifie et génère token
   ✓ Email existe?
   ✓ Mot de passe correct?
   ✓ Compte actif?
   → Générer JWT avec user_id

3. Client utilise le token
   GET /api/articles
   Header: Authorization: Bearer {token}

4. verifyToken middleware
   ✓ Token valide?
   ✓ Pas expiré?
   → Décoder et attacher à req.user

5. Handler traite la requête
   Accès à req.user.user_id, etc.
```

## 📚 Voir aussi

- [../routes/README.md](../routes/README.md) - Routes API
- [../../docs/DEVELOPER_GUIDE.md](../../docs/DEVELOPER_GUIDE.md) - Authentification détaillée
- [../../docs/API_DOCUMENTATION.md](../../docs/API_DOCUMENTATION.md) - Endpoints auth
