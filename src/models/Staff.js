const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Staff = sequelize.define('Staff', {
  staff_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_en: { type: DataTypes.STRING(255), allowNull: true, field: 'staff_name_en' },
  name_fr: { type: DataTypes.STRING(255), allowNull: true, field: 'staff_name_fr' },
  position_en: { type: DataTypes.STRING(255), allowNull: true, field: 'title_en' },
  position_fr: { type: DataTypes.STRING(255), allowNull: true, field: 'title_fr' },
  department_en: { type: DataTypes.STRING(255), allowNull: true, field: 'department_en' },
  department_fr: { type: DataTypes.STRING(255), allowNull: true, field: 'department_fr' },
  bio_en: { type: DataTypes.TEXT, allowNull: true, field: 'description_en' },
  bio_fr: { type: DataTypes.TEXT, allowNull: true, field: 'description_fr' },
  rank_en: { type: DataTypes.STRING(100), allowNull: true, field: 'rank_en' },
  rank_fr: { type: DataTypes.STRING(100), allowNull: true, field: 'rank_fr' },
  photo_url: { type: DataTypes.STRING(500), allowNull: true, field: 'image_url' },
  email: { type: DataTypes.STRING(255), allowNull: true },
  linkedin: { type: DataTypes.STRING(255), allowNull: true },
  x: { type: DataTypes.STRING(255), allowNull: true },
}, {
  tableName: 'staffs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
});

module.exports = Staff;
