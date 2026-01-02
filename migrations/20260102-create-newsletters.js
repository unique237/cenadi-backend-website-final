'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('newsletters', {
      newsletter_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title_en: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      title_fr: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      content_en: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      content_fr: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      published_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    console.log('✅ Table newsletters created successfully');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('newsletters');
    console.log('✅ Table newsletters dropped successfully');
  }
};
