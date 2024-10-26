'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "Bookings";
    await queryInterface.bulkInsert('Bookings', [
      {
        spotId: 1,
        userId: 1,
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-07'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date('2024-11-15'),
        endDate: new Date('2024-11-20'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date('2024-10-10'),
        endDate: new Date('2024-10-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
    ], options); // Passing options here to support schema if in production
  },

  async down (queryInterface, Sequelize) {
    // To revert the seed
    await queryInterface.bulkDelete('Bookings', null, options); // Using options to support schema
  }
};
