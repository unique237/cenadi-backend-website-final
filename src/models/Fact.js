const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Fact = sequelize.define('Fact', {
  fact_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_en: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  name_fr: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  content_en: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content_fr: {
    type: DataTypes.TEXT,
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
  icon_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  posted_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'facts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
});

module.exports = Fact;
