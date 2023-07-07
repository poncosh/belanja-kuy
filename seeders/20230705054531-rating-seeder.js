'use strict';
let ratings = require("../data/rating.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    ratings.forEach(el => {
      el.createdAt = new Date(),
      el.updatedAt = new Date()
    })

    await queryInterface.bulkInsert('Ratings', ratings, {});
    /**
     * Add seed commands here.
     *
     * Example:
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ratings', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
  }
};
