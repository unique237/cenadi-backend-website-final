const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
  category_id: {
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
}, {
  tableName: 'categories',
  timestamps: true,
  underscored: true,
});

module.exports = Category;
