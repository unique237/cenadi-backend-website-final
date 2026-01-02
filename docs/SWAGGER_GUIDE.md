# 📋 Guide Swagger/OpenAPI - CENADI Backend

Guide pour maintenir et améliorer la documentation Swagger/OpenAPI de l'API CENADI.

## 🎯 Vue d'ensemble

L'API CENADI utilise **OpenAPI 3.0** (anciennement Swagger 2.0) pour la documentation interactive.

- **Fichier de configuration**: `src/config/swagger.js`
- **Annotations dans les routes**: Chaque fichier dans `src/routes/`
- **Interface interactive**: `http://localhost:5001/api-docs`

## 📐 Structure OpenAPI 3.0

### Composants obligatoires

```javascript
const options = {
  definition: {
    openapi: '3.0.0',        // Version OpenAPI
    info: { ... },           // Informations générales
    servers: [ ... ],        // Serveurs API
    components: { ... },     // Schémas réutilisables
    paths: { ... },          // Endpoints (auto-générés par JSDoc)
  },
  apis: ['./src/routes/*.js'] // Fichiers avec annotations JSDoc
};
```

## 🏷️ Schémas disponibles

Les schémas sont définis dans `src/config/swagger.js` et accessibles via `$ref`:

```javascript
// Référencer un schéma
$ref: "#/components/schemas/User";
$ref: "#/components/schemas/Article";
$ref: "#/components/schemas/ErrorResponse";
```

### Schémas disponibles:

- `User` - Utilisateur
- `Category` - Catégorie d'article
- `Article` - Article/Actualité
- `Project` - Projet
- `Fact` - Fait/Statistique
- `Staff` - Membre du personnel
- `Partner` - Partenaire
- `Newsletter` - Newsletter
- `DirectorMessage` - Message du Directeur
- `FinanceMinisterMessage` - Message du Ministre
- `EBook` - E-book
- `Asset` - Fichier/Asset
- `ErrorResponse` - Erreur standard
- `SuccessResponse` - Succès standard
- `PaginatedResponse` - Réponse paginée
- `AuthResponse` - Réponse d'authentification

## 📝 Annotations JSDoc Swagger

### Format de base

```javascript
/**
 * @swagger
 * /endpoint:
 *   method:
 *     summary: Description courte
 *     description: Description détaillée
 *     tags: [TagName]
 *     parameters: [ ... ]
 *     requestBody: { ... }
 *     responses: { ... }
 */
router.method("/endpoint", handler);
```

### Exemple complet

```javascript
/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Créer un article
 *     description: Crée un nouvel article en anglais et français
 *     tags: [News]
 *     operationId: createArticle
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Données de l'article
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title_en, title_fr, content_en, content_fr, category_id]
 *             properties:
 *               title_en:
 *                 type: string
 *                 example: My Article Title
 *               title_fr:
 *                 type: string
 *                 example: Mon Titre d'Article
 *               slug_en:
 *                 type: string
 *                 example: my-article-title
 *               slug_fr:
 *                 type: string
 *                 example: mon-titre-darticle
 *               excerpt_en:
 *                 type: string
 *               excerpt_fr:
 *                 type: string
 *               content_en:
 *                 type: string
 *                 description: Contenu HTML ou Markdown
 *               content_fr:
 *                 type: string
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               image_url:
 *                 type: string
 *                 format: uri
 *               is_featured:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 article:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (admin requis)
 *       500:
 *         description: Erreur serveur
 */
router.post("/articles", verifyToken, adminOnly, createArticle);
```

## 🏢 Tags

Les tags organisent les endpoints par catégorie:

```javascript
tags: [
  { name: "Authentication", description: "Endpoints d'authentification" },
  { name: "Users", description: "Gestion des utilisateurs" },
  { name: "News", description: "Gestion des articles" },
  { name: "Facts", description: "Gestion des faits" },
  // etc.
];
```

À utiliser dans les annotations:

```javascript
tags: [News];
tags: [Authentication];
tags: [Facts];
```

## 🔐 Sécurité

### Spécifier l'authentification

```javascript
/**
 * @swagger
 * /protected:
 *   get:
 *     security:
 *       - bearerAuth: []  // Requiert un token JWT
 */
```

### Endpoint public (aucune sécurité)

```javascript
/**
 * @swagger
 * /public:
 *   get:
 *     security: []  // Pas d'authentification requise
 */
```

### Format du Bearer Token

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Paramètres

### Path Parameters

```javascript
/**
 * @swagger
 * /articles/{articleId}:
 *   parameters:
 *     - in: path
 *       name: articleId
 *       required: true
 *       schema:
 *         type: integer
 *         example: 1
 *       description: ID de l'article
 */
```

### Query Parameters

```javascript
/**
 * @swagger
 * /articles:
 *   parameters:
 *     - in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *       description: Numéro de page
 *     - in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         default: 10
 *       description: Éléments par page
 *     - in: query
 *       name: category_id
 *       schema:
 *         type: integer
 *       description: Filtrer par catégorie
 *     - in: query
 *       name: is_featured
 *       schema:
 *         type: boolean
 *       description: Filtrer par vedette
 */
```

### Header Parameters

```javascript
/**
 * @swagger
 * /upload:
 *   parameters:
 *     - in: header
 *       name: Authorization
 *       required: true
 *       schema:
 *         type: string
 *       description: Bearer token
 */
```

## 💾 Request Body

### Schéma inline

```javascript
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required: [email, password]
        properties:
          email:
            type: string
            format: email
            example: user@example.com
          password:
            type: string
            format: password
            example: SecurePassword123
```

### Référencer un schéma

```javascript
requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/Article'
```

### Multipart (fichiers)

```javascript
requestBody:
  required: true
  content:
    multipart/form-data:
      schema:
        type: object
        properties:
          image:
            type: string
            format: binary
          description:
            type: string
```

## 📤 Response Codes

### 200 OK

```javascript
200:
  description: Opération réussie
  content:
    application/json:
      schema:
        type: object
        properties:
          success: { type: boolean, example: true }
          data: { $ref: '#/components/schemas/Article' }
```

### 201 Created

```javascript
201:
  description: Ressource créée
  content:
    application/json:
      schema:
        type: object
        properties:
          success: { type: boolean, example: true }
          message: { type: string }
          article: { $ref: '#/components/schemas/Article' }
```

### 400 Bad Request

```javascript
400:
  description: Données invalides
  content:
    application/json:
      schema:
        type: object
        properties:
          success: { type: boolean, example: false }
          message: { type: string, example: 'Validation error' }
```

### 401 Unauthorized

```javascript
401:
  description: Non authentifié
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/ErrorResponse'
```

### 403 Forbidden

```javascript
403:
  description: Accès refusé (permissions insuffisantes)
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/ErrorResponse'
```

### 404 Not Found

```javascript
404:
  description: Ressource non trouvée
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/ErrorResponse'
```

### 429 Too Many Requests

```javascript
429:
  description: Trop de requêtes (rate limit dépassé)
```

### 500 Internal Server Error

```javascript
500:
  description: Erreur serveur
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/ErrorResponse'
```

## 🔗 Liens et références externes

```javascript
/**
 * @swagger
 * /articles:
 *   get:
 *     externalDocs:
 *       description: Lire la doc complète
 *       url: https://docs.cenadi.com/articles
 */
```

## 📦 Créer un nouveau schéma

Dans `src/config/swagger.js`:

```javascript
components: {
  schemas: {
    MyNewModel: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'Nom' },
        description: { type: 'string' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
      required: ['id', 'name']
    },
  }
}
```

Utiliser ensuite:

```javascript
$ref: "#/components/schemas/MyNewModel";
```

## 🎨 Personnalisation Swagger UI

Dans `src/server.js`:

```javascript
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      // Options de personnalisation
      persistAuthorization: true, // Garder le token après refresh
      filter: true, // Activer la recherche
      deepLinking: true, // URLs shareable pour chaque endpoint
    },
    customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .model-container { background: #f5f5f5; }
  `,
    customSiteTitle: "CENADI API Docs",
  })
);
```

## 🧪 Valider la spec Swagger

Utiliser le validateur OpenAPI officiel:

```bash
npm install -D @apidevtools/swagger-parser

node -e "
const parser = require('@apidevtools/swagger-parser');
parser.validate('http://localhost:5001/api-docs').then(() => {
  console.log('✅ Spec valide');
}).catch(err => {
  console.error('❌ Erreur:', err.message);
});
"
```

## 📥 Importer dans Postman

1. Postman → Import
2. URL: `http://localhost:5001/api-docs`
3. Import

La collection Postman sera créée automatiquement avec tous les endpoints!

## 🚀 Exporter la spec

### Format JSON

```bash
curl http://localhost:5001/api-docs -o openapi.json
```

### Format YAML

```javascript
// src/server.js
const YAML = require("yaml");
const fs = require("fs");

const spec = swaggerSpec;
fs.writeFileSync("openapi.yaml", YAML.stringify(spec, null, 2));
```

## 🔄 Bonnes pratiques

### ✅ À faire

- ✅ Toujours ajouter des descriptions
- ✅ Utiliser des schémas réutilisables
- ✅ Spécifier les codes d'erreur possibles
- ✅ Inclure des exemples de réponse
- ✅ Documenter tous les paramètres
- ✅ Ajouter des tags appropriés
- ✅ Spécifier security où applicable
- ✅ Utiliser operationId unique

### ❌ À éviter

- ❌ Documentation vague
- ❌ Oublier les codes d'erreur
- ❌ Pas d'exemples
- ❌ Incohérence entre la doc et le code
- ❌ Trop complexe, pas assez clair
- ❌ Oublier la sécurité sur endpoints sensibles

## 📚 Ressources

- [OpenAPI 3.0 Spec](https://spec.openapis.org/oas/v3.0.3)
- [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Postman Documentation](https://learning.postman.com/)

## 🆘 Debugging

### Swagger ne se charge pas?

1. Vérifier la console du serveur:

   ```bash
   npm run dev
   # Chercher 'Swagger setup complete'
   ```

2. Vérifier les annotations JSDoc:

   ```bash
   # Les commentaires doivent commencer par /**
   # et inclure @swagger
   ```

3. Vérifier les fichiers de routes:
   ```javascript
   apis: ["./src/routes/*.js"];
   // Doit correspondre aux fichiers réels
   ```

### Endpoint n'apparaît pas?

1. Vérifier que l'annotation JSDoc est au-dessus de la route
2. Vérifier la syntaxe YAML
3. Redémarrer le serveur (les JSDoc commentaires sont parsés au démarrage)

### Schéma non trouvé?

```
// Erreur: '#/components/schemas/MyModel' not found
```

Solution:

1. Vérifier que le schéma est défini dans `swagger.js`
2. Vérifier le nom exact (case-sensitive)
3. Vérifier le chemin: `#/components/schemas/NomExact`

---

**Version**: 2.0.0  
**Dernière mise à jour**: 2 janvier 2026  
**Mainteneur**: CENADI Team
