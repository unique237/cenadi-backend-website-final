const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DirectorMessage = sequelize.define('DirectorMessage', {
  message_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  director_name: { type: DataTypes.STRING(255), allowNull: true },
  title_en: { type: DataTypes.STRING(255), allowNull: true },
  title_fr: { type: DataTypes.STRING(255), allowNull: true },
  excerpt_en: { type: DataTypes.TEXT, allowNull: true },
  excerpt_fr: { type: DataTypes.TEXT, allowNull: true },
  content_en: { type: DataTypes.TEXT, allowNull: true },
  content_fr: { type: DataTypes.TEXT, allowNull: true },
  image_url: { type: DataTypes.STRING(500), allowNull: true },
  x: { type: DataTypes.STRING(255), allowNull: true },
  linkedin: { type: DataTypes.STRING(255), allowNull: true },
  email: { type: DataTypes.STRING(255), allowNull: true },
}, {
  tableName: 'director_messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
});

module.exports = DirectorMessage;
