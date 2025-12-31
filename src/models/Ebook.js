const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ebook = sequelize.define('Ebook', {
  ebook_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title_en: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  title_fr: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description_en: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description_fr: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  author_en: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  author_fr: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  cover_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  file_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pages: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  published_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  added_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'ebooks',
  timestamps: false,
  underscored: true,
});

module.exports = Ebook;
