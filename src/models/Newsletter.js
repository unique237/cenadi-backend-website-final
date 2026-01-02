const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Newsletter = sequelize.define('Newsletter', {
  newsletter_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title_en: { type: DataTypes.STRING(255), allowNull: true },
  title_fr: { type: DataTypes.STRING(255), allowNull: true },
  content_en: { type: DataTypes.TEXT, allowNull: true },
  content_fr: { type: DataTypes.TEXT, allowNull: true },
  published_at: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'newsletters',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
});

module.exports = Newsletter;
