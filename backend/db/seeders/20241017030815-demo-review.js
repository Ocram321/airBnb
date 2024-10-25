let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
    options.tableName = "Reviews";
        await queryInterface.bulkInsert(
            options,
            [
                {
                    spotId: 1,
                    userId: 1,
                    review: "This is my review",
                    stars: 4,
                },
                {
                    spotId: 2,
                    userId: 2,
                    review: "This is my review for spot 2",
                    stars: 5,
                },
                {
                    spotId: 3,
                    userId: 1,
                    review: "This is my review for spot 3",
                    stars: 3,
                },
            ],
            options
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Reviews";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                spotId: { [Op.in]: [1, 2, 3] },
            },
            {}
        );
    },
};
