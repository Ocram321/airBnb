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
                { spotId: 1, url: "https://i.imgur.com/o8RO9RX.jpeg", preview: true },
                { spotId: 1, url: "https://i.imgur.com/lUTVsYS.jpeg", preview: false },
                { spotId: 1, url: "https://i.imgur.com/8FiwFls.jpeg", preview: false },
                { spotId: 1, url: "https://i.imgur.com/idSxI88.jpeg", preview: false },
                { spotId: 1, url: "https://i.imgur.com/5JQBFD0.jpeg", preview: false },
                
                { spotId: 2, url: "https://i.imgur.com/mbwiV0a.jpeg", preview: true },
                { spotId: 2, url: "https://i.imgur.com/Th1OUHc.jpeg", preview: false },
                { spotId: 2, url: "https://i.imgur.com/ComcLWI.jpeg", preview: false },
                { spotId: 2, url: "https://i.imgur.com/ENSKOxp.jpeg", preview: false },
                { spotId: 2, url: "https://i.imgur.com/ikhFj9R.jpeg", preview: false },
                
                { spotId: 3, url: "https://i.imgur.com/MhrnW2S.jpeg", preview: true },
                { spotId: 3, url: "https://i.imgur.com/9Qe2tXZ.jpeg", preview: false },
                { spotId: 3, url: "https://i.imgur.com/KpIJSNU.jpeg", preview: false },
                { spotId: 3, url: "https://i.imgur.com/BDsVJE6.jpeg", preview: false },
                { spotId: 3, url: "https://i.imgur.com/XiRsIEb.jpeg", preview: false },
                
                { spotId: 4, url: "https://i.imgur.com/XiRsIEb.jpeg", preview: true },
                { spotId: 4, url: "https://i.imgur.com/rnEb33E.jpeg", preview: false },
                { spotId: 4, url: "https://i.imgur.com/fzw53OL.jpeg", preview: false },
                { spotId: 4, url: "https://i.imgur.com/ravSgic.jpeg", preview: false },
                { spotId: 4, url: "https://i.imgur.com/ue3rzWK.jpeg", preview: false },
                
                { spotId: 5, url: "https://i.imgur.com/vhlTYUK.jpeg", preview: true },
                { spotId: 5, url: "https://i.imgur.com/9KHfJO6.jpeg", preview: false },
                { spotId: 5, url: "https://i.imgur.com/0Gnegtp.jpeg", preview: false },
                { spotId: 5, url: "https://i.imgur.com/N6DAT7t.jpeg", preview: false },
                { spotId: 5, url: "https://i.imgur.com/QyepD16.jpeg", preview: false },
                
                { spotId: 6, url: "https://i.imgur.com/eLGsFOp.jpeg", preview: true },
                { spotId: 6, url: "https://i.imgur.com/Sq3mPVN.jpeg", preview: false },
                { spotId: 6, url: "https://i.imgur.com/o8RO9RX.jpeg", preview: false },
                { spotId: 6, url: "https://i.imgur.com/lUTVsYS.jpeg", preview: false },
                { spotId: 6, url: "https://i.imgur.com/8FiwFls.jpeg", preview: false },
                
                { spotId: 7, url: "https://i.imgur.com/Th1OUHc.jpeg", preview: true },
                { spotId: 7, url: "https://i.imgur.com/ComcLWI.jpeg", preview: false },
                { spotId: 7, url: "https://i.imgur.com/ENSKOxp.jpeg", preview: false },
                { spotId: 7, url: "https://i.imgur.com/ikhFj9R.jpeg", preview: false },
                { spotId: 7, url: "https://i.imgur.com/MhrnW2S.jpeg", preview: false },
                
                { spotId: 8, url: "https://i.imgur.com/bsRNYrf.jpeg", preview: true },
                { spotId: 8, url: "https://i.imgur.com/9Qe2tXZ.jpeg", preview: false },
                { spotId: 8, url: "https://i.imgur.com/KpIJSNU.jpeg", preview: false },
                { spotId: 8, url: "https://i.imgur.com/BDsVJE6.jpeg", preview: false },
                { spotId: 8, url: "https://i.imgur.com/XiRsIEb.jpeg", preview: false },

                { spotId: 9, url: "https://i.imgur.com/rnEb33E.jpeg", preview: true },
                { spotId: 9, url: "https://i.imgur.com/fzw53OL.jpeg", preview: false },
                { spotId: 9, url: "https://i.imgur.com/ravSgic.jpeg", preview: false },
                { spotId: 9, url: "https://i.imgur.com/ue3rzWK.jpeg", preview: false },
                { spotId: 9, url: "https://i.imgur.com/vhlTYUK.jpeg", preview: false },
                
                { spotId: 10, url: "https://i.imgur.com/9KHfJO6.jpeg", preview: true },
                { spotId: 10, url: "https://i.imgur.com/0Gnegtp.jpeg", preview: false },
                { spotId: 10, url: "https://i.imgur.com/N6DAT7t.jpeg", preview: false },
                { spotId: 10, url: "https://i.imgur.com/QyepD16.jpeg", preview: false },
                { spotId: 10, url: "https://i.imgur.com/eLGsFOp.jpeg", preview: false }
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "SpotImages";
        await queryInterface.bulkDelete(options, null, {});
    },
};
