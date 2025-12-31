const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Project = sequelize.define('Project', {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title_en: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  title_fr: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description_en: {
    type: DataTypes.TEXT,
  },
  description_fr: {
    type: DataTypes.TEXT,
  },
  link: {
    type: DataTypes.STRING(500),
    defaultValue: 'cenadi.cm',
  },
  image_url: {
    type: DataTypes.STRING(500),
  },
  posted_on: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'projects',
  timestamps: true,
  underscored: true,
});

module.exports = Project;
