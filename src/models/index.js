const { sequelize } = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Article = require('./Article');
const Project = require('./Project');

// Export tous les modèles
const models = {
  User,
  Category,
  Article,
  Project,
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
