# 📦 Modèles Sequelize

Ce dossier contient tous les modèles de données Sequelize ORM pour PostgreSQL.

## 📁 Modèles disponibles

```
models/
├── User.js                  # Utilisateurs et authentification
├── Category.js              # Catégories d'articles
├── Article.js               # Articles/News
├── Project.js               # Projets
├── Fact.js                  # Faits & Statistiques
├── Staff.js                 # Personnel
├── Partner.js               # Partenaires
├── Newsletter.js            # Newsletters
├── DirectorMessage.js       # Messages du directeur
├── FinanceMinisterMessage.js # Messages du ministre
├── EBook.js                 # E-books
├── Asset.js                 # Ressources/Assets
├── Subscriber.js            # Abonnés newsletters
└── index.js                 # Export des modèles
```

## 📋 Structure d'un modèle

```javascript
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Model = sequelize.define(
    "ModelName",
    {
      // Colonnes
      model_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "model_names",
      timestamps: true,
    }
  );

  // Associations
  Model.associate = (models) => {
    Model.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return Model;
};
```

## 🔗 Associations

### One-to-Many

```javascript
Article.belongsTo(User, { foreignKey: "author_id" });
User.hasMany(Article, { foreignKey: "author_id" });
```

### Many-to-Many

```javascript
Article.belongsToMany(Category, { through: "ArticleCategories" });
Category.belongsToMany(Article, { through: "ArticleCategories" });
```

## 📊 Modèles clés

### User

```javascript
{
  user_id: Integer (PK),
  username: String (unique),
  email: String (unique),
  name: String,
  password_hash: String,
  role: Enum['admin', 'author'],
  status: Enum['pending', 'active', 'suspended'],
  created_at: DateTime,
  updated_at: DateTime
}
```

### Article

```javascript
{
  article_id: Integer (PK),
  category_id: Integer (FK),
  author_id: Integer (FK),
  title_en: String,
  title_fr: String,
  slug_en: String,
  slug_fr: String,
  content_en: Text,
  content_fr: Text,
  image_url: String,
  is_featured: Boolean,
  published_at: DateTime,
  created_at: DateTime,
  updated_at: DateTime
}
```

### Project

```javascript
{
  project_id: Integer (PK),
  title_en: String,
  title_fr: String,
  description_en: Text,
  description_fr: Text,
  link: String,
  image_url: String,
  status: Enum['active', 'completed', 'pending'],
  budget: Decimal,
  posted_on: DateTime,
  created_at: DateTime,
  updated_at: DateTime
}
```

## 🔐 Types de données

| Type                      | PostgreSQL | Utilisation          |
| ------------------------- | ---------- | -------------------- |
| `DataTypes.INTEGER`       | INTEGER    | IDs, nombres entiers |
| `DataTypes.STRING(255)`   | VARCHAR    | Textes courts        |
| `DataTypes.TEXT`          | TEXT       | Contenu long         |
| `DataTypes.BOOLEAN`       | BOOLEAN    | Drapeaux             |
| `DataTypes.DATE`          | TIMESTAMP  | Dates/Times          |
| `DataTypes.DECIMAL(10,2)` | NUMERIC    | Montants financiers  |
| `DataTypes.ENUM`          | ENUM       | Valeurs limitées     |

## ✅ Bonnes pratiques

### Valeurs par défaut

```javascript
created_at: {
  type: DataTypes.DATE,
  defaultValue: DataTypes.NOW,
  allowNull: false,
}
```

### Unicité

```javascript
email: {
  type: DataTypes.STRING,
  unique: true,
  validate: { isEmail: true },
}
```

### Validations

```javascript
age: {
  type: DataTypes.INTEGER,
  validate: {
    isInt: true,
    min: 0,
    max: 150,
  },
}
```

### Indexes

```javascript
name: {
  type: DataTypes.STRING,
  index: true,
}
```

## 🔄 Migrations

Quand vous modifiez un modèle, créez une migration:

```bash
npx sequelize-cli migration:generate --name add_column_to_table
```

Éditez le fichier généré dans `migrations/`:

```javascript
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("articles", "new_column", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("articles", "new_column");
  },
};
```

Puis exécutez:

```bash
npm run migrate
```

## 🧪 Queries Sequelize

```javascript
// Find all
const all = await Model.findAll();

// Find by ID
const item = await Model.findByPk(id);

// Create
const new = await Model.create({ name: 'Test' });

// Update
await Model.update({ name: 'Updated' }, { where: { id } });

// Delete
await Model.destroy({ where: { id } });

// With associations
const item = await Article.findByPk(id, {
  include: [{ model: User, attributes: ['name', 'email'] }]
});

// Pagination
const { count, rows } = await Model.findAndCountAll({
  offset: (page - 1) * limit,
  limit,
});
```

## 📚 Voir aussi

- [controllers/README.md](../controllers/README.md) - Contrôleurs
- [routes/README.md](../routes/README.md) - Routes
- [docs/DEVELOPER_GUIDE.md](../../docs/DEVELOPER_GUIDE.md) - Patterns Sequelize détaillés
- [Sequelize Docs](https://sequelize.org/) - Documentation officielle
