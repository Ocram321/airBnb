'use strict';

const review = require('../models/review');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await review.BulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: "This is my reveiw ",
        stars: 4
      },
      {
        spotId: 2,
        userId: 2,
        review: "This is my reveiw for spot 2 ",
        stars: 5
      },
      {
        spotId: 3,
        userId: 1,
        review: "This is my reveiw for spot 3",
        stars: 3
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
