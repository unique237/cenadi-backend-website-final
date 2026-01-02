const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ebook = sequelize.define('Ebook', {
  ebook_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'book_id' },
  title_en: { type: DataTypes.STRING(255), allowNull: true },
  title_fr: { type: DataTypes.STRING(255), allowNull: true },
  description_en: { type: DataTypes.TEXT, allowNull: true },
  description_fr: { type: DataTypes.TEXT, allowNull: true },
  cover_url: { type: DataTypes.STRING(500), allowNull: true, field: 'image_url' },
  file_url: { type: DataTypes.STRING(500), allowNull: true, field: 'link' },
  posted_on: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'ebooks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
});

module.exports = Ebook;
