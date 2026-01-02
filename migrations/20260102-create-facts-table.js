'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('facts', {
      fact_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      content_en: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      content_fr: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      order_index: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      posted_on: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('facts');
  },
};
