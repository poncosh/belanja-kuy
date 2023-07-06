'use strict';
let stores = require("../data/stores.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    stores.forEach((el) => {
      el.createdAt = new Date(),
      el.updatedAt = new Date()
    })

    return queryInterface.bulkInsert('Stores', stores, {});
    /**
     * Add seed commands here.
     *
     * Example:
    */
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Stores', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
  }
};
