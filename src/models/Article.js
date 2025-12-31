const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Category = require('./Category');
const User = require('./User');

const Article = sequelize.define('Article', {
  article_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'category_id',
    },
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id',
    },
  },
  title_en: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  title_fr: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  slug_en: {
    type: DataTypes.STRING(300),
    allowNull: false,
    unique: true,
  },
  slug_fr: {
    type: DataTypes.STRING(300),
    allowNull: false,
    unique: true,
  },
  excerpt_en: {
    type: DataTypes.TEXT,
  },
  excerpt_fr: {
    type: DataTypes.TEXT,
  },
  content_en: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content_fr: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING(500),
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  published_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'articles',
  timestamps: true,
  underscored: true,
});

// Relations
Article.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Article.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

Category.hasMany(Article, { foreignKey: 'category_id', as: 'articles' });
User.hasMany(Article, { foreignKey: 'author_id', as: 'articles' });

module.exports = Article;
