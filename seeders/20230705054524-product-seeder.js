'use strict';
let products = require("../data/product.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    products.forEach(el => {
      el.createdAt = new Date(),
      el.updatedAt = new Date()
    })

    await queryInterface.bulkInsert('Products', products, {});
    /**
     * Add seed commands here.
     *
     * Example:
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
  }
};
