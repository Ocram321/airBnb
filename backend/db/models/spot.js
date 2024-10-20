"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Spot extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Spot.belongsTo(models.User, {
                foreignKey: "ownerId",
            });
            Spot.hasMany(models.Review, {
                foreignKey: "spotId",
                as: "reviews",
                onDelete: "CASCADE",
            });
            Spot.hasMany(models.SpotImage, {
                foreignKey: "spotId",
                as: "spotImages",
                onDelete: "CASCADE",
            });
            Spot.hasMany(models.Booking, {
                foreignKey: "spotId",
                as: "bookings",
                onDelete: "CASCADE",
            });
        }
    }
    Spot.init(
        {
            ownerId: DataTypes.INTEGER,
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lat: {
                type: DataTypes.NUMERIC,
                allowNull: false,
            },
            lng: {
                type: DataTypes.NUMERIC,
                allowNull: false,
            },
            name:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(11, 2),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Spot",
        }
    );
    return Spot;
};
