"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA; // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Spots";
        await queryInterface.createTable(
            options.tableName,
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                ownerId: {
                    type: Sequelize.INTEGER,
                    references: { model: "Users", key: "id" }, // Ensures ownerId links to Users table
                    allowNull: false,
                },
                address: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                city: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                state: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                country: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                lat: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                },
                lng: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    validate: { len: [0, 50] },
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
                price: {
                    type: Sequelize.DECIMAL,
                    allowNull: false,
                    validate: { min: 0 },
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
            },
            options
        );
    },
    async down(queryInterface, Sequelize) {
        options.tableName = "Spots";
        await queryInterface.dropTable(options);
    },
};
