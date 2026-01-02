const bcrypt = require('bcryptjs');
const { User, Category, Newsletter, Partner, sequelize } = require('../models');
const logger = require('../config/logger');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('🌱 Starting database seeding...');

    const userCount = await User.count();
    if (userCount === 0) {
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
    } else {
      logger.info(`⚠️ Users already present (${userCount}). Skipping user seeding...`);
    }

    const categoryCount = await Category.count();
    if (categoryCount === 0) {
      const categories = await Category.bulkCreate([
        { name_en: 'News', name_fr: 'Actualités' },
        { name_en: 'Events', name_fr: 'Événements' },
        { name_en: 'Publications', name_fr: 'Publications' },
        { name_en: 'Announcements', name_fr: 'Annonces' },
      ]);
      logger.info(`✅ ${categories.length} categories created`);
    } else {
      logger.info(`⚠️ Categories already present (${categoryCount}). Skipping category seeding...`);
    }

    const newsletterCount = await Newsletter.count();
    if (newsletterCount === 0) {
      const newsletters = await Newsletter.bulkCreate([
        {
          title_en: 'March 2024 Newsletter - Innovations and Projects',
          title_fr: 'Newsletter Mars 2024 - Innovations et Projets',
          content_en: 'Dear subscribers, this month we present our latest digital transformation projects and technological innovations that we are implementing to modernize the Congolese public administration.',
          content_fr: 'Chers abonnés, ce mois-ci nous vous présentons nos derniers projets de transformation numérique et les innovations technologiques que nous mettons en place pour moderniser l\'administration publique congolaise.',
          published_at: new Date('2024-03-01T10:00:00Z'),
        },
        {
          title_en: 'February 2024 Newsletter - Training and Workshops',
          title_fr: 'Newsletter Février 2024 - Formations et Ateliers',
          content_en: 'CENADI invites you to participate in our upcoming training sessions in cybersecurity, web development and IT project management. Register now!',
          content_fr: 'Le CENADI vous invite à participer à nos prochaines sessions de formation en cybersécurité, développement web et gestion de projets IT. Inscrivez-vous dès maintenant!',
          published_at: new Date('2024-02-01T10:00:00Z'),
        },
        {
          title_en: 'April 2024 Newsletter - Partnerships and Collaborations',
          title_fr: 'Newsletter Avril 2024 - Partenariats et Collaborations',
          content_en: 'We are proud to announce new partnerships with international organizations to strengthen our capabilities in digital transformation and technological innovation.',
          content_fr: 'Nous sommes fiers d\'annoncer de nouveaux partenariats avec des organisations internationales pour renforcer nos capacités en matière de transformation numérique et d\'innovation technologique.',
          published_at: new Date('2024-04-01T10:00:00Z'),
        },
        {
          title_en: 'May 2024 Newsletter - Events and Conferences',
          title_fr: 'Newsletter Mai 2024 - Événements et Conférences',
          content_en: 'CENADI is organizing its annual conference on artificial intelligence and digital transformation. Don\'t miss this major event that will bring together industry experts.',
          content_fr: 'Le CENADI organise sa conférence annuelle sur l\'intelligence artificielle et la transformation numérique. Ne manquez pas cet événement majeur qui réunira les experts du secteur.',
          published_at: new Date('2024-05-01T10:00:00Z'),
        },
        {
          title_en: 'Special Newsletter - 2023 Annual Report',
          title_fr: 'Newsletter Spéciale - Rapport Annuel 2023',
          content_en: 'Looking back on a year rich in achievements. Check out our 2023 annual report and discover all the projects completed, training provided and partnerships established.',
          content_fr: 'Retour sur une année riche en réalisations. Consultez notre rapport annuel 2023 et découvrez tous les projets menés à bien, les formations dispensées et les partenariats établis.',
          published_at: new Date('2024-01-15T10:00:00Z'),
        },
      ]);
      logger.info(`✅ ${newsletters.length} newsletters created`);
    } else {
      logger.info(`⚠️ Newsletters already present (${newsletterCount}). Skipping newsletter seeding...`);
    }

    const partnerCount = await Partner.count();
    if (partnerCount === 0) {
      const partners = await Partner.bulkCreate([
        {
          name_en: 'World Bank',
          name_fr: 'Banque Mondiale',
          description_en: 'International financial institution providing loans and grants for development projects.',
          description_fr: 'Institution financière internationale fournissant des prêts et des subventions pour les projets de développement.',
          logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/World_Bank_logo.svg/200px-World_Bank_logo.svg.png',
          website: 'https://www.worldbank.org',
        },
        {
          name_en: 'African Development Bank',
          name_fr: 'Banque Africaine de Développement',
          description_en: 'Multilateral development finance institution promoting economic and social development in Africa.',
          description_fr: 'Institution multilatérale de financement du développement favorisant le développement économique et social en Afrique.',
          logo_url: 'https://www.afdb.org/themes/custom/afdb/logo.svg',
          website: 'https://www.afdb.org',
        },
        {
          name_en: 'United Nations Development Programme',
          name_fr: 'Programme des Nations Unies pour le Développement',
          description_en: 'UN agency working to eradicate poverty and reduce inequalities through sustainable development.',
          description_fr: 'Agence de l\'ONU œuvrant pour l\'éradication de la pauvreté et la réduction des inégalités par le développement durable.',
          logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/UNDP_logo.svg/200px-UNDP_logo.svg.png',
          website: 'https://www.undp.org',
        },
      ]);
      logger.info(`✅ ${partners.length} partners created`);
    } else {
      logger.info(`⚠️ Partners already present (${partnerCount}). Skipping partner seeding...`);
    }

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
