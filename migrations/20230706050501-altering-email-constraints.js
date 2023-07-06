'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const sequelize = new Sequelize('belanja-kuy', 'postgres', 'postgres', {
      dialect: 'postgres'
    });

    await sequelize.query(`ALTER TABLE "Users" ADD CONSTRAINT UC_Users UNIQUE (email,password)`);
    /**
     * Add altering commands here.
     *
     * Example:
     */
  },

  async down (queryInterface, Sequelize) {
    const sequelize = new Sequelize('belanja-kuy', 'postgres', 'postgres', {
      dialect: 'postgres'
    });

    await sequelize.query(`ALTER TABLE "Users" DROP CONSTRAINT UC_Users`);;
    /**
     * Add reverting commands here.
     *
     * Example:
     */
  }
};
