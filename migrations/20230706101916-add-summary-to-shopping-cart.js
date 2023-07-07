'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('ShoppingCarts', 'summary_shop', { type: Sequelize.DataTypes.INTEGER });
    /**
     * Add altering commands here.
     *
     * Example:
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ShoppingCarts', 'summary_shop');
    /**
     * Add reverting commands here.
     *
     * Example:
     */
  }
};
