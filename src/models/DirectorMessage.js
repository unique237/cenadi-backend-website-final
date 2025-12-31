const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DirectorMessage = sequelize.define('DirectorMessage', {
  message_id: {
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
  content_en: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content_fr: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  director_name_en: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  director_name_fr: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  director_photo: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  posted_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'director_messages',
  timestamps: false,
  underscored: true,
});

module.exports = DirectorMessage;
