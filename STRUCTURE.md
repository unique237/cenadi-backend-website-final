# 📚 Guide de navigation du projet

## 🎯 À quoi sert chaque dossier?

### `src/` - Code source principal
Point d'entrée pour tous les fichiers de code.

#### `src/server.js`
**Le cœur de l'app** - Initialise Express, charge les middlewares et routes

#### `src/config/`
**Configuration** - BD, Swagger, uploads

| Fichier | Rôle |
|---------|------|
| `database.js` | Connexion Sequelize PostgreSQL |
| `swagger.js` | Configuration OpenAPI 3.0 |
| `storage.js` | Configuration Multer uploads |

#### `src/models/`
**Schémas de données** - Définit la structure de chaque table

| Fichier | Table |
|---------|-------|
| `User.js` | Utilisateurs |
| `Article.js` | Articles/News |
| `Category.js` | Catégories |
| `Project.js` | Projets |
| `Fact.js` | Faits & Stats |
| `Staff.js` | Personnel |
| `Partner.js` | Partenaires |
| `Newsletter.js` | Newsletters |
| `EBook.js` | E-books |
| `DirectorMessage.js` | Messages directeur |
| `FinanceMinisterMessage.js` | Messages ministre |

👉 **Voir**: [src/models/README.md](src/models/README.md)

#### `src/routes/`
**Points d'entrée API** - Définit chaque endpoint HTTP

| Fichier | Endpoints |
|---------|-----------|
| `authRoutes.js` | /auth/* |
| `newsRoutes.js` | /news/* |
| `projectRoutes.js` | /projects/* |
| `factRoutes.js` | /facts/* |
| `staffRoutes.js` | /staffs/* |
| `partnerRoutes.js` | /partners/* |
| `newsletterRoutes.js` | /newsletters/* |
| `uploadRoutes.js` | /upload/* |

👉 **Voir**: [src/routes/README.md](src/routes/README.md)

#### `src/controllers/`
**Logique métier** - Code exécuté par chaque endpoint

```
newsRoutes.js → newsController.js → newsModel.js → PostgreSQL
(route)          (logique)          (données)
```

👉 **Voir**: [src/controllers/README.md](src/controllers/README.md)

#### `src/middleware/`
**Intercepteurs** - Authentification, uploads, erreurs

| Fichier | Rôle |
|---------|------|
| `auth.js` | JWT, verifyToken, adminOnly |
| `upload.js` | Multer configuration |
| `errorHandler.js` | Gestion erreurs centralisée |

👉 **Voir**: [src/middleware/README.md](src/middleware/README.md)

#### `src/seeders/`
**Données initiales** - Remplissage de la BD

```bash
npm run seed  # Charge les données de test
```

👉 **Voir**: [src/seeders/README.md](src/seeders/README.md)

#### `src/__tests__/`
**Tests unitaires** - Jest, couverture de code

```bash
npm test      # Exécute les tests
npm run coverage
```

---

### `docs/` - Documentation
Ressources pour comprendre et utiliser l'API

| Fichier | Pour qui | Contenu |
|---------|----------|---------|
| **INDEX.md** | Tous | Guide navigation doc |
| **API_DOCUMENTATION.md** | Frontend devs | Tous les endpoints |
| **DEVELOPER_GUIDE.md** | Backend devs | Setup, patterns, debug |
| **SWAGGER_GUIDE.md** | Documenters | Maintenance Swagger |
| **DOCUMENTATION_README.md** | Tous | Accès rapide, dépannage |
| **DOCUMENTATION_UPDATE_SUMMARY.md** | Project mgr | Statistiques, roadmap |

👉 **Accès rapide**: [docs/INDEX.md](docs/INDEX.md)

---

### `migrations/` - Historique BD
Scripts de migration Sequelize

```bash
npm run migrate        # Appliquer migrations
npm run migrate:undo   # Annuler dernière migration
```

---

### `uploads/` - Fichiers uploadés
Images, PDFs, logos (ignoré par Git)

```
uploads/
├── news/        # Images articles
├── projects/    # Images projets
├── partners/    # Logos partenaires
├── staff/       # Photos personnel
└── ebooks/      # PDFs e-books
```

---

### `logs/` - Fichiers journaux
Logs Winston (ignorés par Git)

```
logs/combined.log  # Tous les logs
```

---

### `coverage/` - Tests coverage
Rapports de couverture des tests

```bash
npm run coverage  # Générer rapport
# Ouvrir coverage/lcov-report/index.html
```

---

## 🚀 Workflows courants

### Créer un nouvel endpoint

```
1. Créer le modèle
   → src/models/MyModel.js

2. Créer le contrôleur
   → src/controllers/myController.js
   
3. Créer les routes
   → src/routes/myRoutes.js
   → Ajouter annotations @swagger
   
4. Importer dans server.js
   → app.use('/api', myRoutes);
   
5. Tester
   → http://localhost:5001/api-docs
   
6. Documenter
   → docs/API_DOCUMENTATION.md
```

### Modifier la BD

```
1. Modifiez le modèle
   → src/models/Article.js

2. Créez une migration
   → npm run migrate:create -- add_column_to_articles

3. Éditez la migration
   → migrations/XXXXX-add_column_to_articles.js

4. Appliquez la migration
   → npm run migrate

5. Mettez à jour les contrôleurs
   → src/controllers/articleController.js
```

### Ajouter une validation

```
1. Dans la route
   router.post('/news', validate(newsSchema), createNews);

2. Définissez le schéma Joi
   const newsSchema = Joi.object({
     title_en: Joi.string().required(),
     content_en: Joi.string().required(),
   });
```

---

## 📊 Vue d'ensemble visuelle

```
                        ┌─────────────────┐
                        │   PostgreSQL    │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │   Sequelize ORM │
                        └────────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
             ┌──────▼──────┐         ┌──────▼──────┐
             │   Models    │         │ Controllers │
             │  (schemas)  │         │  (logique)  │
             └──────▲──────┘         └──────┬──────┘
                    │                        │
             ┌──────┴────────────────────────▼──────┐
             │           Routes (endpoints)        │
             └──────┬────────────────────────┬──────┘
                    │                        │
           ┌────────▼─────┐         ┌───────▼──────┐
           │  Middleware  │         │  Validators  │
           │ (auth, logs) │         │ (Joi, etc.)  │
           └────────▲─────┘         └───────▲──────┘
                    │                        │
                    └────────┬───────────────┘
                             │
                      ┌──────▼──────┐
                      │  HTTP Server│
                      │  (Express)  │
                      └──────┬──────┘
                             │
                      ┌──────▼──────┐
                      │   Clients   │
                      │  (Frontend) │
                      └─────────────┘
```

---

## 🔍 Trouver rapidement

| Je cherche | Où chercher |
|-----------|-------------|
| Comment créer un endpoint? | docs/DEVELOPER_GUIDE.md |
| Documentation API? | docs/API_DOCUMENTATION.md |
| Authentification? | src/middleware/auth.js |
| Modèle Article? | src/models/Article.js |
| Route /news? | src/routes/newsRoutes.js |
| Contrôleur news? | src/controllers/newsController.v2.js |
| Données de test? | src/seeders/seed.js |
| Tests? | src/__tests__/ |
| Configuration BD? | src/config/database.js |
| Configuration Swagger? | src/config/swagger.js |

---

## 📞 Questions?

Consultez les READMEs:
- [docs/INDEX.md](docs/INDEX.md) - Guide de doc
- [src/models/README.md](src/models/README.md) - Modèles
- [src/routes/README.md](src/routes/README.md) - Routes
- [src/controllers/README.md](src/controllers/README.md) - Contrôleurs
- [src/middleware/README.md](src/middleware/README.md) - Middlewares

---

**Bonne exploration! 🚀**
