"use strict";

const { options } = require('../../routes/api/spotimages');
let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // Define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        options.tableName = "SpotImages";
        return queryInterface.bulkInsert(
            options,
            [
                {
                    spotId: 1,
                    url: "https://randompicture.com/image1.jpg",
                    preview: true,
                },
                {
                    spotId: 1,
                    url: "https://randompicture.com/image2.jpg",
                    preview: true,
                },
                {
                    spotId: 2,
                    url: "https://randompicture.com/image3.jpg",
                    preview: true,
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        options.tableName = "SpotImages"; // Ensure the table name is set for schema handling
        return queryInterface.bulkDelete(options, null, {}); // Pass the options object to bulkDelete for schema support
    },
};
