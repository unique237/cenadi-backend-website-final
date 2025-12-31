const bcrypt = require('bcryptjs');
const { User, Category, sequelize } = require('../models');
const logger = require('../config/logger');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('🌱 Starting database seeding...');

    // Check if data already exists
    const userCount = await User.count();
    if (userCount > 0) {
      logger.info('⚠️ Database already seeded. Skipping...');
      return;
    }

    // Seed Admin User
    const adminPassword = await bcrypt.hash('SecureAdmin123', 10);
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@cenadi.cm',
      name: 'Administrateur CENADI',
      password_hash: adminPassword,
      role: 'admin',
      status: 'active',
    });
    logger.info(`✅ Admin user created: ${adminUser.email}`);

    // Seed Author User
    const authorPassword = await bcrypt.hash('SecureAuthor123', 10);
    const authorUser = await User.create({
      username: 'author',
      email: 'author@cenadi.cm',
      name: 'Auteur CENADI',
      password_hash: authorPassword,
      role: 'author',
      status: 'active',
    });
    logger.info(`✅ Author user created: ${authorUser.email}`);

    // Seed Categories
    const categories = await Category.bulkCreate([
      { name_en: 'News', name_fr: 'Actualités' },
      { name_en: 'Events', name_fr: 'Événements' },
      { name_en: 'Publications', name_fr: 'Publications' },
      { name_en: 'Announcements', name_fr: 'Annonces' },
    ]);
    logger.info(`✅ ${categories.length} categories created`);

    logger.info('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
