'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if columns exist before adding them
    const tableDescription = await queryInterface.describeTable('facts');
    
    if (!tableDescription.title) {
      await queryInterface.addColumn('facts', 'title', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
    
    if (!tableDescription.value) {
      await queryInterface.addColumn('facts', 'value', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    
    if (!tableDescription.icon) {
      await queryInterface.addColumn('facts', 'icon', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    
    if (!tableDescription.order_index) {
      await queryInterface.addColumn('facts', 'order_index', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      });
    }
    
    if (!tableDescription.created_at) {
      await queryInterface.addColumn('facts', 'created_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove added columns
    await queryInterface.removeColumn('facts', 'title');
    await queryInterface.removeColumn('facts', 'value');
    await queryInterface.removeColumn('facts', 'icon');
    await queryInterface.removeColumn('facts', 'order_index');
    await queryInterface.removeColumn('facts', 'created_at');
  },
};
