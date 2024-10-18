"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "ReviewImages",
            [
                {
                    reviewId: 1,
                    url: "www.randompicture.com",
                },
                {
                    reviewId: 2,
                    url: "www.randompicture2.com",
                },
                {
                    reviewId: 3,
                    url: "www.randompicture3.com",
                },
            ],
            options
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "ReviewImages";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                reviewId: { [Op.in]: [1, 2, 3] },
            },
            {}
        );
    },
};
