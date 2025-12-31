const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Partner = sequelize.define('Partner', {
  partner_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_en: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  name_fr: {
    type: DataTypes.STRING(100),
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
  logo_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  added_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'partners',
  timestamps: false,
  underscored: true,
});

module.exports = Partner;
