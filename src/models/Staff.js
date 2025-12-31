const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Staff = sequelize.define('Staff', {
  staff_id: {
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
  position_en: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  position_fr: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  department_en: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  department_fr: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  bio_en: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bio_fr: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  photo_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  tableName: 'staffs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
});

module.exports = Staff;
