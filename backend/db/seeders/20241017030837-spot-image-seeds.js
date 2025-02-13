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
                    url: "https://mario.wiki.gallery/images/3/3a/SM3DL-_Bowser%27s_Castle_Intro.png",
                    preview: true,
                },
                {
                    spotId: 1,
                    url: "https://mario.wiki.gallery/images/8/8c/Peach%27s_Castle_SM64_exterior.png",
                    preview: false,
                },
                {
                    spotId: 2,
                    url: "https://media.sketchfab.com/models/f609112d34b74fb99971b92ead5a07f0/thumbnails/319ee72491ec41ce999d27d28246fb72/1508d8b579134aa0878e80e40b806550.jpeg",
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
