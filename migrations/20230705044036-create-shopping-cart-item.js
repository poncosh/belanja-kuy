'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShoppingCartItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProductId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Products'
          },
          key: 'id'
        },
        allowNull: false
      },
      ShoppingCartId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'ShoppingCarts'
          },
          key: 'id'
        },
        allowNull: false
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ShoppingCartItems');
  }
};