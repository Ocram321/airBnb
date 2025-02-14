"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // Define schema in options object if in production
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
                    userId: 2,
                    review: "This is my review for spot 1",
                    stars: 5,
                },
                {
                    spotId: 2,
                    userId: 1,
                    review: "This is my review for spot 2",
                    stars: 5,
                },
                {
                    spotId: 3,
                    userId: 1,
                    review: "This is my review for spot 3",
                    stars: 3,
                },
                {
                    spotId: 4,
                    userId: 3,
                    review: "Absolutely thrilling! Bowser’s Castle was the perfect mix of danger and excitement. Watch out for the lava pits!",
                    stars: 4,
                },
                {
                    spotId: 5,
                    userId: 4,
                    review: "Stunning views, but the road is a bit slippery! Loved the experience of floating through space. 10/10 would visit again!",
                    stars: 5,
                },
                {
                    spotId: 6,
                    userId: 5,
                    review: "Boo’s Mansion was both creepy and fun! The ghosts kept disappearing when I looked at them... Very immersive experience!",
                    stars: 4,
                },
                {
                    spotId: 7,
                    userId: 6,
                    review: "Yoshi’s Island was so relaxing! The beach, the palm trees, and even the friendly Yoshis made this a perfect getaway.",
                    stars: 5,
                },
                {
                    spotId: 8,
                    userId: 7,
                    review: "DK’s Treehouse was an adventure! Woke up to the sound of jungle drums and swinging vines. Loved the fresh bananas!",
                    stars: 4,
                },
                {
                    spotId: 9,
                    userId: 8,
                    review: "Koopa Troopa Beach was paradise! Crystal-clear water, soft sand, and a few secret tunnels to explore. Perfect vacation spot!",
                    stars: 5,
                },
                {
                    spotId: 10,
                    userId: 9,
                    review: "Toad’s Highway Hotel was a wild experience! The constant traffic made it feel like a real-life Mario Kart race. Great city vibes!",
                    stars: 3,
                }
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Reviews";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
            },
            {}
        );
    },
};