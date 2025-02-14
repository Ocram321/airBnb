"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // Define schema in options object if in production
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "SpotImages";
        await queryInterface.bulkInsert(
            options,
            [
                { spotId: 1, url: "https://imgur.com/o8RO9RX", preview: true },
                { spotId: 1, url: "https://imgur.com/lUTVsYS", preview: false },
                { spotId: 1, url: "https://imgur.com/8FiwFls", preview: false },
                { spotId: 1, url: "https://imgur.com/idSxI88", preview: false },
                { spotId: 1, url: "https://imgur.com/5JQBFD0", preview: false },
                
                { spotId: 2, url: "https://imgur.com/mbwiV0a", preview: true },
                { spotId: 2, url: "https://imgur.com/Th1OUHc", preview: false },
                { spotId: 2, url: "https://imgur.com/ComcLWI", preview: false },
                { spotId: 2, url: "https://imgur.com/ENSKOxp", preview: false },
                { spotId: 2, url: "https://imgur.com/ikhFj9R", preview: false },
                
                { spotId: 3, url: "https://imgur.com/MhrnW2S", preview: true },
                { spotId: 3, url: "https://imgur.com/9Qe2tXZ", preview: false },
                { spotId: 3, url: "https://imgur.com/KpIJSNU", preview: false },
                { spotId: 3, url: "https://imgur.com/BDsVJE6", preview: false },
                { spotId: 3, url: "https://imgur.com/XiRsIEb", preview: false },
                
                { spotId: 4, url: "https://imgur.com/XiRsIEb", preview: true },
                { spotId: 4, url: "https://imgur.com/rnEb33E", preview: false },
                { spotId: 4, url: "https://imgur.com/fzw53OL", preview: false },
                { spotId: 4, url: "https://imgur.com/ravSgic", preview: false },
                { spotId: 4, url: "https://imgur.com/ue3rzWK", preview: false },
                
                { spotId: 5, url: "https://imgur.com/vhlTYUK", preview: true },
                { spotId: 5, url: "https://imgur.com/9KHfJO6", preview: false },
                { spotId: 5, url: "https://imgur.com/0Gnegtp", preview: false },
                { spotId: 5, url: "https://imgur.com/N6DAT7t", preview: false },
                { spotId: 5, url: "https://imgur.com/QyepD16", preview: false },
                
                { spotId: 6, url: "https://imgur.com/eLGsFOp", preview: true },
                { spotId: 6, url: "https://imgur.com/Sq3mPVN", preview: false },
                { spotId: 6, url: "https://imgur.com/o8RO9RX", preview: false },
                { spotId: 6, url: "https://imgur.com/lUTVsYS", preview: false },
                { spotId: 6, url: "https://imgur.com/8FiwFls", preview: false },
                
                { spotId: 7, url: "https://imgur.com/Th1OUHc", preview: true },
                { spotId: 7, url: "https://imgur.com/ComcLWI", preview: false },
                { spotId: 7, url: "https://imgur.com/ENSKOxp", preview: false },
                { spotId: 7, url: "https://imgur.com/ikhFj9R", preview: false },
                { spotId: 7, url: "https://imgur.com/MhrnW2S", preview: false },
                
                { spotId: 8, url: "https://imgur.com/bsRNYrf", preview: true },
                { spotId: 8, url: "https://imgur.com/9Qe2tXZ", preview: false },
                { spotId: 8, url: "https://imgur.com/KpIJSNU", preview: false },
                { spotId: 8, url: "https://imgur.com/BDsVJE6", preview: false },
                { spotId: 8, url: "https://imgur.com/XiRsIEb", preview: false },

                { spotId: 9, url: "https://imgur.com/rnEb33E", preview: true },
                { spotId: 9, url: "https://imgur.com/fzw53OL", preview: false },
                { spotId: 9, url: "https://imgur.com/ravSgic", preview: false },
                { spotId: 9, url: "https://imgur.com/ue3rzWK", preview: false },
                { spotId: 9, url: "https://imgur.com/vhlTYUK", preview: false },
                
                { spotId: 10, url: "https://imgur.com/9KHfJO6", preview: true },
                { spotId: 10, url: "https://imgur.com/0Gnegtp", preview: false },
                { spotId: 10, url: "https://imgur.com/N6DAT7t", preview: false },
                { spotId: 10, url: "https://imgur.com/QyepD16", preview: false },
                { spotId: 10, url: "https://imgur.com/eLGsFOp", preview: false }
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "SpotImages";
        await queryInterface.bulkDelete(options, null, {});
    },
};
