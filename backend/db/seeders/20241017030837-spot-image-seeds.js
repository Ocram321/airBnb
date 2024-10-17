"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            "SpotImages",
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
        return queryInterface.bulkDelete("SpotImages", null, {});
    },
};
