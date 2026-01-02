# 🔌 Routes API

Ce dossier contient toutes les définitions des routes API avec les annotations Swagger/OpenAPI 3.0.

## 📁 Structure

```
routes/
├── authRoutes.js                    # Authentification (signin, signup, logout)
├── userRoutes.js                    # Gestion des utilisateurs
├── categoryRoutes.js                # Catégories d'articles
├── newsRoutes.js                    # Articles/News (CRUD)
├── projectRoutes.js                 # Projets (CRUD)
├── factRoutes.js                    # Faits & Statistiques (CRUD)
├── staffRoutes.js                   # Personnel (CRUD)
├── partnerRoutes.js                 # Partenaires (CRUD)
├── newsletterRoutes.js              # Newsletters (CRUD)
├── directorMessageRoutes.js         # Messages du directeur
├── financeMinisterMessageRoutes.js  # Messages du ministre
├── ebookRoutes.js                   # E-books (CRUD)
├── uploadRoutes.js                  # Upload de fichiers
├── contactRoutes.js                 # Formulaire de contact
└── subcribeRoutes.js                # Abonnements aux newsletters
```

## 🏷️ Tags Swagger

Chaque route est documentée avec un tag pour l'organisation dans Swagger:

| Tag                | Routes                      | Fichier                                                   |
| ------------------ | --------------------------- | --------------------------------------------------------- |
| **Authentication** | signin, signup, logout      | authRoutes.js                                             |
| **Users**          | CRUD utilisateurs           | userRoutes.js                                             |
| **Categories**     | CRUD catégories             | categoryRoutes.js                                         |
| **News**           | CRUD articles               | newsRoutes.js                                             |
| **Projects**       | CRUD projets                | projectRoutes.js                                          |
| **Facts**          | CRUD faits                  | factRoutes.js                                             |
| **Staff**          | CRUD personnel              | staffRoutes.js                                            |
| **Partners**       | CRUD partenaires            | partnerRoutes.js                                          |
| **Newsletters**    | CRUD newsletters            | newsletterRoutes.js                                       |
| **Messages**       | Messages directeur/ministre | directorMessageRoutes.js, financeMinisterMessageRoutes.js |
| **EBooks**         | CRUD e-books                | ebookRoutes.js                                            |
| **Uploads**        | Upload fichiers             | uploadRoutes.js                                           |

## 📖 Documentation Swagger

Chaque route inclut une annotation `@swagger` JSDoc:

```javascript
/**
 * @swagger
 * /news:
 *   get:
 *     summary: Lister les articles
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste des articles
 */
router.get("/news", getAllNews);
```

## 🔐 Authentification

Les routes protégées utilisent le middleware `verifyToken`:

```javascript
router.post("/news", verifyToken, adminOnly, createNews);
```

### Middleware disponibles

- `verifyToken` - Valide le JWT
- `adminOnly` - Restreint aux admins
- `upload.single('image')` - Upload d'un seul fichier

## 🔌 Ajouter une nouvelle route

1. Créez un fichier `src/routes/myRoutes.js`
2. Importez le contrôleur
3. Définissez les routes avec annotations Swagger
4. Importez dans `src/server.js`

```javascript
const myRoutes = require("./routes/myRoutes");
app.use("/api", myRoutes);
```

## ✅ Checklist Swagger

Quand vous créez une route, vérifiez:

- [ ] Tag Swagger (`tags: [MyTag]`)
- [ ] Summary court et clair
- [ ] Description détaillée
- [ ] Parameters documentés
- [ ] RequestBody défini
- [ ] Responses (200, 400, 401, 404, 500)
- [ ] Exemple dans la response
- [ ] Security si protégée (`security: [{bearerAuth: []}]`)

## 📚 Voir aussi

- [docs/API_DOCUMENTATION.md](../docs/API_DOCUMENTATION.md) - Endpoints complets
- [docs/SWAGGER_GUIDE.md](../docs/SWAGGER_GUIDE.md) - Guide Swagger
- [../README.md](../README.md) - Vue d'ensemble
