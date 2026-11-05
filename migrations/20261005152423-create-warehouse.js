'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('warehouses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      operator: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.STRING,
      },
      sub_category: {
        type: Sequelize.STRING,
      },
      price_limit: {
        type: Sequelize.STRING,
      },
      origin: {
        type: Sequelize.STRING,
      },
      number: {
        type: Sequelize.STRING,
      },
      attachment: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('warehouses');
  },
};