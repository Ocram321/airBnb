"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // Define schema in options object if in production
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
                    preview: false,
                },
                {
                    spotId: 2,
                    url: "https://randompicture.com/image3.jpg",
                    preview: true,
                },
            ],
            { validate: true } // Enable validation for data integrity
        );
    },

    down: async (queryInterface, Sequelize) => {
        options.tableName = "SpotImages";
        return queryInterface.bulkDelete(options, null, {}); // Use options to support schema if in production
    },
};
