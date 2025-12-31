const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Fact = sequelize.define('Fact', {
  fact_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content_en: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content_fr: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  posted_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'facts',
  timestamps: false,
  underscored: true,
});

module.exports = Fact;
