"use strict";

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Users";

        await queryInterface.bulkInsert(
            options,
            [
                {
                    email: "demo@user.io",
                    username: "Demo-lition",
                    firstName: "Marco",
                    lastName: "Milinovich",
                    hashedPassword: bcrypt.hashSync("password"),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    email: "user1@user.io",
                    username: "FakeUser1",
                    firstName: "Marco",
                    lastName: "Milinovich",
                    hashedPassword: bcrypt.hashSync("password2"),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    email: "user2@user.io",
                    username: "FakeUser2",
                    firstName: "Marco",
                    lastName: "Milinovich",
                    hashedPassword: bcrypt.hashSync("password3"),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    email: "mario@user.io",
                    username: "SuperMario",
                    firstName: "Mario",
                    lastName: "Mario",
                    hashedPassword: bcrypt.hashSync("mushroom"),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    email: "luigi@user.io",
                    username: "GreenMachine",
                    firstName: "Luigi",
                    lastName: "Mario",
                    hashedPassword: bcrypt.hashSync("greenpower"),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    email: "peach@user.io",
                    username: "PrincessPeach",
                    firstName: "Peach",
                    lastName: "Toadstool",
                    hashedPassword: bcrypt.hashSync("royalty"),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    email: "bowser@user.io",
                    username: "KingKoopa",
                    firstName: "Bowser",
                    lastName: "Koopa",
                    hashedPassword: bcrypt.hashSync("firebreath"),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    email: "toad@user.io",
                    username: "MushroomBuddy",
                    firstName: "Toad",
                    lastName: "Mushroom",
                    hashedPassword: bcrypt.hashSync("toadstool"),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Users";

        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                username: {
                    [Op.in]: [
                        "Demo-lition", "FakeUser1", "FakeUser2",
                        "SuperMario", "GreenMachine", "PrincessPeach",
                        "KingKoopa", "MushroomBuddy"
                    ],
                },
            },
            {}
        );
    },
};
