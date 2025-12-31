const { sequelize } = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Article = require('./Article');
const Project = require('./Project');
const Staff = require('./Staff');
const Partner = require('./Partner');
const Fact = require('./Fact');
const Ebook = require('./Ebook');
const DirectorMessage = require('./DirectorMessage');
const MinisterMessage = require('./MinisterMessage');
const Asset = require('./Asset');
const Subscriber = require('./Subscriber');

// Export tous les modèles
const models = {
  User,
  Category,
  Article,
  Project,
  Staff,
  Partner,
  Fact,
  Ebook,
  DirectorMessage,
  MinisterMessage,
  Asset,
  Subscriber,
  sequelize,
};

// Sync database (à utiliser en développement uniquement)
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ All models synchronized successfully.');
  } catch (error) {
    console.error('❌ Error synchronizing models:', error);
    throw error;
  }
};

module.exports = { ...models, syncDatabase };
