const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subscriber = sequelize.define('Subscriber', {
  subscriber_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  subscribed_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('active', 'unsubscribed'),
    allowNull: false,
    defaultValue: 'active',
  },
}, {
  tableName: 'subscribers',
  timestamps: false,
  underscored: true,
});

module.exports = Subscriber;
