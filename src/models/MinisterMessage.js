const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MinisterMessage = sequelize.define('MinisterMessage', {
  message_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  minister_name: { type: DataTypes.STRING(255), allowNull: true },
  content_en: { type: DataTypes.TEXT, allowNull: true },
  content_fr: { type: DataTypes.TEXT, allowNull: true },
  image_url: { type: DataTypes.STRING(500), allowNull: true },
  telephone: { type: DataTypes.STRING(20), allowNull: true },
  email: { type: DataTypes.STRING(255), allowNull: true },
  website: { type: DataTypes.STRING(500), allowNull: true },
}, {
  tableName: 'finance_minister_messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
});

module.exports = MinisterMessage;
