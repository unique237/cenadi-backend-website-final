# Routes - Mise à jour v2 (Sequelize ORM)

## 📋 Fichiers modifiés

### 1. [userRoutes.js](src/routes/userRoutes.js)
```javascript
// ✅ Avant: require('../controllers/userController')
// ✅ Après:  require('../controllers/userController.v2')
```

**Endpoints**:
- `POST /auth/signup` - Inscription utilisateur
- `POST /auth/signin` - Connexion utilisateur
- `GET /users` - Liste des utilisateurs (Auth requis)
- `GET /users/:userId` - Détails utilisateur (Auth requis)
- `PUT /users/:userId` - Mettre à jour utilisateur (Admin)
- `DELETE /users/:userId` - Supprimer utilisateur (Admin)

---

### 2. [categoryRoutes.js](src/routes/categoryRoutes.js)
```javascript
// ✅ Avant: require('../controllers/categoryControllers')
// ✅ Après:  require('../controllers/categoryControllers.v2')
```

**Endpoints**:
- `GET /categories` - Liste des catégories (Public)
- `GET /categories/:categoryId` - Détails catégorie (Public)
- `POST /categories` - Créer catégorie (Admin)
- `PUT /categories/:categoryId` - Mettre à jour (Admin)
- `DELETE /categories/:categoryId` - Supprimer (Admin)

---

### 3. [newsRoutes.js](src/routes/newsRoutes.js)
```javascript
// ✅ Avant: require('../controllers/newsController')
// ✅ Après:  require('../controllers/newsController.v2')
```

**Endpoints**:
- `GET /news` - Liste articles (Public, avec pagination + filtres)
- `GET /news/slug/:slug` - Article par slug (Public)
- `GET /news/:articleId` - Article par ID (Public)
- `POST /news` - Créer article (Auth requis)
- `PUT /news/:articleId` - Mettre à jour (Auth requis)
- `DELETE /news/:articleId` - Supprimer (Auth requis)

**Nouveaux endpoints (v2)**:
- `GET /news/featured` - Articles en vedette
- `GET /news/search?query=...` - Recherche articles

---

### 4. [projectRoutes.js](src/routes/projectRoutes.js)
```javascript
// ✅ Avant: require('../controllers/projectController')
// ✅ Après:  require('../controllers/projectController.v2')
```

**Endpoints**:
- `GET /projects` - Liste projets (Public)
- `GET /projects/:projectId` - Détails projet (Public)
- `POST /projects` - Créer projet (Admin)
- `PUT /projects/:projectId` - Mettre à jour (Admin)
- `DELETE /projects/:projectId` - Supprimer (Admin)

**Nouveaux endpoints (v2)**:
- `GET /projects/search?query=...` - Recherche projets

---

### 5. [subcribeRoutes.js](src/routes/subcribeRoutes.js)
```javascript
// ✅ Avant: const { sendSubscribeMail } = require('../controllers/subscribeController')
// ✅ Après:  const { subscribe, unsubscribe } = require('../controllers/subscribeController.v2')

// ✅ Avant: router.post('/subscribe', ..., sendSubscribeMail)
// ✅ Après:  router.post('/subscribe', ..., subscribe)
//           router.post('/unsubscribe', ..., unsubscribe)
```

**Endpoints**:
- `POST /subscribe` - S'abonner à la newsletter
- `POST /unsubscribe` - Se désabonner

**Nouveaux endpoints (v2)**:
- `GET /subscribers` - Lister les abonnés (Admin)
- `DELETE /subscribers/:subscriberId` - Supprimer abonné (Admin)

---

## 🔄 Changements

### Améliorations ORM
✅ Tous les contrôleurs utilisent maintenant **Sequelize ORM**
✅ Pas de requêtes SQL brutes
✅ Relations automatiques avec `include`
✅ Validation des données intégrée
✅ Logging Winston partout

### Avantages
- 🔐 Anti-injection SQL automatique
- 🛠️ Code plus maintenable
- ⚡ Performance optimisée (pool de connexions)
- 🔍 Recherche avancée (Op.iLike, Op.or)

---

## ✅ Tests

### Serveur
```bash
✅ Démarrage: npm start
✅ Port: 5001
✅ Sequelize: Connection established
✅ Toutes les routes chargées
```

### Endpoints
```bash
GET /api/categories
→ Retourne liste catégories avec Sequelize

GET /api/users
→ Retourne liste utilisateurs (Auth requis)

POST /api/subscribe
→ Abonnement newsletter (v2)
```

---

## 📊 Résumé

| Fichier | Ancienne version | Nouvelle version | État |
|---------|-----------------|-----------------|------|
| userRoutes.js | userController | userController.v2 | ✅ |
| categoryRoutes.js | categoryControllers | categoryControllers.v2 | ✅ |
| newsRoutes.js | newsController | newsController.v2 | ✅ |
| projectRoutes.js | projectController | projectController.v2 | ✅ |
| subcribeRoutes.js | subscribeController | subscribeController.v2 | ✅ |
| contactRoutes.js | (pas de changement) | contactController | ⏳ |

---

## 🚀 Prochaines étapes

1. **Phase 7 - Documentation API (Swagger)**
   - Installer swagger-ui-express et swagger-jsdoc
   - Ajouter JSDoc commentaires à toutes les routes
   - Générer API documentation

2. **Ajouter les autres contrôleurs v2 aux routes**
   - staffRoutes.js → staffController.v2.js
   - partnerRoutes.js → partnerController.v2.js
   - etc.

3. **Supprimer les anciens contrôleurs**
   - userController.js (garder v2.js)
   - categoryControllers.js (garder v2.js)
   - newsController.js (garder v2.js)
   - projectController.js (garder v2.js)
   - subscribeController.js (garder v2.js)
