# Phase 6 : Migrations DB + ORM Sequelize

## 📦 Packages installés

```bash
npm install sequelize sequelize-cli db-migrate db-migrate-pg --save
```

- **Sequelize**: ORM moderne pour Node.js
- **sequelize-cli**: CLI pour générer migrations/modèles/seeders
- **db-migrate**: Système de migrations versionnées
- **db-migrate-pg**: Driver PostgreSQL pour db-migrate

## 🏗️ Architecture Sequelize

### Configuration (src/config/database.js)

```javascript
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: "postgres",
  pool: { max: 10, min: 0 },
  define: { timestamps: true, underscored: true },
});
```

### Modèles créés (src/models/)

| Modèle       | Table      | Relations                 |
| ------------ | ---------- | ------------------------- |
| **User**     | users      | hasMany(Article)          |
| **Category** | categories | hasMany(Article)          |
| **Article**  | articles   | belongsTo(User, Category) |
| **Project**  | projects   | -                         |

### Fonctionnalités ORM

✅ **Validation automatique** : Email validation, ENUM checks  
✅ **Relations** : Article.belongsTo(Category), User.hasMany(Article)  
✅ **Timestamps** : created_at, updated_at automatiques  
✅ **Underscored naming** : snake_case pour colonnes DB  
✅ **Transactions** : Support natif avec sequelize.transaction()

## 🔄 Contrôleurs refactorisés

### Avant (SQL brut)

```javascript
const result = await pool.query(
  "SELECT * FROM categories WHERE category_id = $1",
  [categoryId]
);
```

### Après (Sequelize ORM)

```javascript
const category = await Category.findByPk(categoryId, {
  include: [{ model: Article, as: "articles" }],
});
```

### Avantages

- ✅ **Requêtes plus lisibles** : API fluide au lieu de SQL strings
- ✅ **Protection SQL injection** : Automatique avec paramètres
- ✅ **Relations simplifiées** : `include` pour JOIN automatiques
- ✅ **Validations** : Email, ENUM, required fields
- ✅ **Hooks** : beforeCreate, afterUpdate pour logique métier

## 🗄️ Fichiers créés

### Modèles Sequelize

- [src/models/User.js](src/models/User.js) - Modèle User avec validation email
- [src/models/Category.js](src/models/Category.js) - Modèle Category bilingue
- [src/models/Article.js](src/models/Article.js) - Modèle Article avec relations
- [src/models/Project.js](src/models/Project.js) - Modèle Project
- [src/models/index.js](src/models/index.js) - Export centralisé + sync helper

### Contrôleurs v2 (avec ORM)

- [src/controllers/categoryControllers.v2.js](src/controllers/categoryControllers.v2.js)
- [src/controllers/userController.v2.js](src/controllers/userController.v2.js)

### Seeders

- [src/seeders/seed.js](src/seeders/seed.js) - Admin + Author + 4 catégories

### Migrations

- [migrations/20251231-add-subscribers-email-index.js](migrations/20251231-add-subscribers-email-index.js)
- [database.json](database.json) - Configuration db-migrate

### Configuration

- [src/config/database.js](src/config/database.js) - Sequelize config + test connexion

## 🚀 Scripts npm disponibles

```bash
# Migrations db-migrate
npm run db:migrate:up       # Appliquer migrations
npm run db:migrate:down     # Rollback dernière migration
npm run db:migrate:create   # Créer nouvelle migration

# Seeders
npm run db:seed             # Peupler DB avec données test

# Sync Sequelize (dev uniquement)
npm run db:sync             # Sync modèles avec DB (ALTER)
```

## 📝 Exemple d'utilisation

### 1. Créer un article avec relations

```javascript
const Article = require("./models/Article");

const article = await Article.create({
  title_en: "My Article",
  title_fr: "Mon Article",
  category_id: 1,
  author_id: 1,
  content_en: "Content...",
  content_fr: "Contenu...",
  slug_en: "my-article",
  slug_fr: "mon-article",
});
```

### 2. Query avec relations (JOIN automatique)

```javascript
const articles = await Article.findAll({
  include: [
    { model: Category, as: "category" },
    { model: User, as: "author", attributes: ["name", "email"] },
  ],
  where: { is_featured: true },
  order: [["published_at", "DESC"]],
  limit: 10,
});
```

### 3. Pagination avec count

```javascript
const { count, rows } = await Article.findAndCountAll({
  where: { category_id: 1 },
  limit: 10,
  offset: 0,
});
// count = total, rows = résultats page
```

### 4. Transactions

```javascript
const t = await sequelize.transaction();
try {
  await User.create({ ... }, { transaction: t });
  await Article.create({ ... }, { transaction: t });
  await t.commit();
} catch (error) {
  await t.rollback();
}
```

## 🔧 Configuration vs Old System

| Aspect         | Ancien (pg driver) | Nouveau (Sequelize)            |
| -------------- | ------------------ | ------------------------------ |
| **Requêtes**   | SQL brut strings   | Méthodes ORM (findAll, create) |
| **Paramètres** | $1, $2, $3         | Objets JavaScript              |
| **Relations**  | JOIN manuels       | include automatique            |
| **Validation** | Manuelle           | Déclarative dans modèle        |
| **Migrations** | SQL files ad-hoc   | db-migrate versionnées         |
| **Seeders**    | SQL INSERT         | JavaScript avec models         |

## ⚡ Performance

- **Pool connexions** : 10 max, réutilisation automatique
- **Lazy loading** : Relations chargées uniquement si `include`
- **Indexes** : Définis dans migrations pour optimisation
- **Prepared statements** : Automatique avec Sequelize

## 🧪 Tests avec Sequelize

```javascript
// Mock Sequelize dans tests
jest.mock('../models/User');
User.findOne = jest.fn().mockResolvedValue({ ... });

// Ou utiliser DB test
process.env.DB_NAME = 'cenadi_test';
await sequelize.sync({ force: true }); // Reset DB test
```

## 📊 Comparaison queries

### Get all categories avec count articles

**Avant (SQL):**

```javascript
const result = await pool.query(`
  SELECT c.*, COUNT(a.article_id) as article_count
  FROM categories c
  LEFT JOIN articles a ON c.category_id = a.category_id
  GROUP BY c.category_id
`);
```

**Après (Sequelize):**

```javascript
const categories = await Category.findAll({
  include: [
    {
      model: Article,
      as: "articles",
      attributes: [],
    },
  ],
  attributes: {
    include: [
      [
        sequelize.fn("COUNT", sequelize.col("articles.article_id")),
        "article_count",
      ],
    ],
  },
  group: ["Category.category_id"],
});
```

## 🎯 Prochaines étapes (Phase 7)

- [ ] Refactoriser tous les contrôleurs vers Sequelize
- [ ] Ajouter modèles Staff, Partner, Ebook, Fact, etc.
- [ ] Implémenter soft deletes (paranoid: true)
- [ ] Ajouter hooks pour auto-slugify
- [ ] Documentation API avec Swagger

## ✅ Phase 6 - COMPLÈTE

**Réalisations :**

- ✅ Sequelize ORM installé et configuré
- ✅ 4 modèles créés avec relations (User, Category, Article, Project)
- ✅ 2 contrôleurs refactorisés (v2)
- ✅ Seeders fonctionnels (admin + catégories)
- ✅ db-migrate configuré avec exemple migration
- ✅ Scripts npm pour migrations/seeders
- ✅ Test connexion Sequelize au démarrage serveur

**Bénéfices :**

- Code plus maintenable et lisible
- Protection SQL injection automatique
- Validations déclaratives
- Relations simplifiées (include)
- Migrations versionnées
