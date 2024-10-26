"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Spots"
        await queryInterface.bulkInsert(
         options,
            [
                {
                    ownerId: 1,
                    address: "1  First St",
                    city: "San Deigo",
                    state: "California",
                    country: "United States of America",
                    lat: 32.7495,
                    lng: -117.247,
                    name: "SD Beach house",
                    description: "Wake up next to the beach.",
                    price: 150,
                },
                {
                    ownerId: 2,
                    address: "2 Beach Blvd",
                    city: "Los Angeles",
                    state: "California",
                    country: "United States of America",
                    lat: 34.0523,
                    lng: -118.2438,
                    name: "LA Apartment",
                    description: "Live like a star in Los Angeles.",
                    price: 300,
                },
                {
                    ownerId: 3,
                    address: "3 Third Place",
                    city: "New York City",
                    state: "New York",
                    country: "United States of America",
                    lat: 40.7128,
                    lng: -74.006,
                    name: "The Big Apple",
                    description: "Watch out I'm walking",
                    price: 100,
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete (options, null, {});
    },
};
