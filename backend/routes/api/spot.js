const express = require("express");
const {
    Spot,
    Review,
    User,
    ReviewImage,
    SpotImage,
    Sequelize,
} = require("../../db/models"); // Assuming models are in a folder named models
const router = express.Router();
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");
const { requireAuth, restoreUser } = require("../../utils/auth");

const validateReview = [
    check("review")
        .exists({ checkFalsy: true })
        .withMessage("Review text is required"),
    check("stars")
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors,
];

const validateSpot = [
    check("address")
        .exists({ checkFalsy: true })
        .withMessage("Street address is required"),
    check("city").exists({ checkFalsy: true }).withMessage("City is required"),
    check("state")
        .exists({ checkFalsy: true })
        .withMessage("State is required"),
    check("country")
        .exists({ checkFalsy: true })
        .withMessage("Country is required"),
    check("lat")
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be within -90 and 90"),
    check("lng")
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be within -180 and 180"),
    check("name")
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage("Name must be less than 50 characters"),
    check("description")
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
    check("price")
        .exists({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage("Price per day must be a positive number"),
    handleValidationErrors,
];
// Route: Get all Spots
// Method: GET
// Path: /api/spots
// Description: Fetches all the spots from the database without authentication.
router.get("/", async (req, res) => {
    try {
        const {
            page = 1,
            size = 20,
            minLat,
            maxLat,
            minLng,
            maxLng,
            minPrice,
            maxPrice
        } = req.query;

        const pageInt = parseInt(page) || 1;
        const sizeInt = parseInt(size) || 20;

        const errors = {};
        if (pageInt < 1) errors.page = "Page must be greater than or equal to 1";
        if (sizeInt < 1 || sizeInt > 20) errors.size = "Size must be between 1 and 20";
        if (minLat && isNaN(parseFloat(minLat))) errors.minLat = "Minimum latitude is invalid";
        if (maxLat && isNaN(parseFloat(maxLat))) errors.maxLat = "Maximum latitude is invalid";
        if (minLng && isNaN(parseFloat(minLng))) errors.minLng = "Minimum longitude is invalid";
        if (maxLng && isNaN(parseFloat(maxLng))) errors.maxLng = "Maximum longitude is invalid";
        if (minPrice && (isNaN(parseFloat(minPrice)) || minPrice < 0)) errors.minPrice = "Minimum price must be greater than or equal to 0";
        if (maxPrice && (isNaN(parseFloat(maxPrice)) || maxPrice < 0)) errors.maxPrice = "Maximum price must be greater than or equal to 0";

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Bad Request",
                errors
            });
        }

        const whereConditions = {};
        if (minLat) whereConditions.lat = { [Sequelize.Op.gte]: parseFloat(minLat) };
        if (maxLat) whereConditions.lat = { ...whereConditions.lat, [Sequelize.Op.lte]: parseFloat(maxLat) };
        if (minLng) whereConditions.lng = { [Sequelize.Op.gte]: parseFloat(minLng) };
        if (maxLng) whereConditions.lng = { ...whereConditions.lng, [Sequelize.Op.lte]: parseFloat(maxLng) };
        if (minPrice) whereConditions.price = { [Sequelize.Op.gte]: parseFloat(minPrice) };
        if (maxPrice) whereConditions.price = { ...whereConditions.price, [Sequelize.Op.lte]: parseFloat(maxPrice) };

        const spots = await Spot.findAll({
            where: whereConditions,
            limit: sizeInt,
            offset: (pageInt - 1) * sizeInt,
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(
                            SELECT AVG(stars)
                            FROM Reviews
                            WHERE Reviews.spotId = Spot.id
                        )`),
                        "avgRating",
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT "url"
                            FROM "SpotImages" AS image
                            WHERE image."spotId" = Spot.id AND image.preview = true
                            LIMIT 1
                        )`),
                        "previewImage",
                    ],
                ],
            },
            include: [
                {
                    model: SpotImage,
                    as: "SpotImages",
                    attributes: [],
                    where: { preview: true },
                    required: false,
                },
            ],
        });

        const formattedSpots = spots.map((spot) => {
            const spotData = spot.toJSON();
            return {
                id: spotData.id,
                ownerId: spotData.ownerId,
                address: spotData.address,
                city: spotData.city,
                state: spotData.state,
                country: spotData.country,
                lat: parseFloat(spotData.lat),
                lng: parseFloat(spotData.lng),
                name: spotData.name,
                description: spotData.description,
                price: parseFloat(spotData.price),
                createdAt: spotData.createdAt.toISOString(),
                updatedAt: spotData.updatedAt.toISOString(),
                avgRating: spotData.avgRating ? parseFloat(spotData.avgRating.toFixed(1)) : null,
                previewImage: spotData.previewImage || null,
            };
        });

        res.status(200).json({ Spots: formattedSpots, page: pageInt, size: sizeInt });
    } catch (err) {
        console.error("Error retrieving spots:", err);
        res.status(500).json({ message: "Server error" });
    }
});
// Route: Get all Spgots owned by the Current User
// Method: GET
// Path: /api/spots/current
// Description: Fetches all spots created by the current authenticated user.
router.get("/current", restoreUser, requireAuth, async (req, res) => {
    const userId = req.user.id;

    try {
        const spots = await Spot.findAll({
            where: { ownerId: userId },
            attributes: {
                include: [
                    // Calculate avgRating from associated reviews
                    [
                        Sequelize.fn("AVG", Sequelize.col("Reviews.stars")),
                        "avgRating",
                    ],
                    // Select the preview image URL
                    [Sequelize.col("SpotImages.url"), "previewImage"],
                ],
            },
            include: [
                {
                    model: Review,
                    as: "Reviews",
                    attributes: ["stars"], // Only need avgRating, exclude other review fields
                },
                {
                    model: SpotImage,
                    as: "SpotImages",
                    attributes: [], // Only need preview image URL
                    where: { preview: true }, // Only include preview images
                    required: false, // Allow spots without a preview image
                },
            ],
            group: ["Spot.id", "SpotImages.id"], // Group by Spot and SpotImage
        });

        // Format spots to match API spec and ensure correct data types
        const formattedSpots = spots.map((spot) => ({
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: parseFloat(spot.lat),
            lng: parseFloat(spot.lng),
            name: spot.name,
            description: spot.description,
            price: parseFloat(spot.price),
            createdAt: new Date(spot.createdAt).toISOString(),
            updatedAt: new Date(spot.updatedAt).toISOString(),
            avgRating: spot.avgRating
                ? parseFloat(spot.avgRating.toFixed(1))
                : null,
            previewImage: spot.previewImage //|| null,
        }));

        res.status(200).json({ Spots: formattedSpots });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Route: Get details of a Spot by id
// Method: GET
// Path: /api/spots/:spotId
// Description: Fetches the details of a specific spot by its ID.
router.get("/:spotId", async (req, res) => {
    const { spotId } = req.params;

    try {
        const spot = await Spot.findByPk(spotId, {
            include: [
                {
                    model: Review,
                    as: "Reviews",
                    attributes: [
                        // Calculate numReviews and avgStarRating from reviews
                        [
                            Sequelize.fn("COUNT", Sequelize.col("Reviews.id")),
                            "numReviews",
                        ],
                        [
                            Sequelize.fn("AVG", Sequelize.col("Reviews.stars")),
                            "avgStarRating",
                        ],
                    ],
                },
                {
                    model: SpotImage,
                    as: "SpotImages", // Use the alias defined in the Spot model
                    attributes: ["id", "url", "preview"], // Include image details
                },
                {
                    model: User,
                    as: "Owner", // Use the alias defined in the Spot model
                    attributes: ["id", "firstName", "lastName"], // Include only necessary fields
                },
            ],
            attributes: [
                "id",
                "ownerId",
                "address",
                "city",
                "state",
                "country",
                "lat",
                "lng",
                "name",
                "description",
                "price",
                "createdAt",
                "updatedAt",
            ],
            group: ["Spot.id", "SpotImages.id", "Owner.id"], // Group by Spot, SpotImage, and Owner for aggregation
        });

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const spotData = spot.toJSON();

        // Format the response to match expected structure
        const formattedSpot = {
            ...spotData,
            avgStarRating: spotData.avgStarRating
                ? parseFloat(spotData.avgStarRating.toFixed(1))
                : null,
            numReviews: parseInt(spotData.numReviews, 10) || 0,
            SpotImages: spotData.SpotImages || [],
            Owner: spotData.Owner || null,
        };

        res.status(200).json(formattedSpot);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Route: Create a Spot
// Method: POST
// Path: /api/spots
// Description: Creates a new spot and returns the created spot data.
router.post("/", requireAuth, validateSpot, async (req, res) => {
    // Placeholder for authentication middleware
    // Assume req.user contains the logged-in user
    const userId = req.user.id;
    const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
    } = req.body;

    try {
        const newSpot = await Spot.create({
            ownerId: userId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        });

        res.status(201).json(newSpot);
    } catch (err) {
        res.status(400).json({ message: "Validation error", errors: err });
    }
});

// Route: Edit a Spot
// Method: PUT
// Path: /api/spots/:spotId
// Description: Updates a specific spot and returns the updated spot.
const { validationResult } = require("express-validator");

router.put(
    "/:spotId",
    restoreUser,
    requireAuth,
    validateSpot,
    async (req, res) => {
        const { spotId } = req.params;
        const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        } = req.body;

        // Handle validation errors from validateSpot middleware
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            const errors = validationErrors.array().reduce((acc, err) => {
                acc[err.param] = err.msg;
                return acc;
            }, {});
            return res.status(400).json({ message: "Bad Request", errors });
        }

        try {
            const spot = await Spot.findByPk(spotId);

            // 404 Error: Spot not found
            if (!spot) {
                return res
                    .status(404)
                    .json({ message: "Spot couldn't be found" });
            }

            // Authorization: Check if the current user owns the spot
            if (spot.ownerId !== req.user.id) {
                return res.status(403).json({ message: "Forbidden" });
            }

            // Update the spot with validated data
            await spot.update(
                ({
                    address,
                    city,
                    state,
                    country,
                    lat,
                    lng,
                    name,
                    description,
                    price,
                } = req.body)
            );

            // Format and send the updated spot as a response
            res.status(200).json({
                id: spot.id,
                ownerId: spot.ownerId,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: parseFloat(spot.lat),
                lng: parseFloat(spot.lng),
                name: spot.name,
                description: spot.description,
                price: parseFloat(spot.price),
                createdAt: spot.createdAt.toISOString(),
                updatedAt: spot.updatedAt.toISOString(),
            });
        } catch (err) {
            console.error("Error updating spot:", err);
            res.status(500).json({ message: "Server error" });
        }
    }
);
// Route: Delete a Spot
// Method: DELETE
// Path: /api/spots/:spotId
// Description: Deletes a specific spot and returns a success message.
router.delete("/:spotId", restoreUser, requireAuth, async (req, res) => {
    const { spotId } = req.params;

    try {
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }
        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await spot.destroy();
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Route: Add an Image to a Spot by id
// Method: POST
// Path: /api/spots/:spotId/images
router.post("/:spotId/images", restoreUser, requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;
    try {
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const newSpotImage = await SpotImage.create({
            spotId,
            url,
            preview,
        });

        res.status(201).json(newSpotImage);
    } catch (err) {
        res.status(400).json({
            message: "Error adding image",
            errors: err.errors,
        });
    }
});

//  Get all Reviews by a Spot's id
// Method : GET
// Path: /api/spots/:spotId/reviews
// Collins route for reviews
router.get("/:spotId/reviews", async (req, res) => {
    const { spotId } = req.params;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const reviews = await Review.findAll({
            where: { spotId },
            include: [
                {
                    model: User,
                    attributes: ["id", "firstName", "lastName"],
                },
                {
                    model: ReviewImage,
                    as: "ReviewImages", // Use the alias defined in the association
                    attributes: ["id", "url"],
                },
            ],
        });

        res.status(200).json({ Reviews: reviews });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 3. Create a Review for a Spot based on the Spot's id
// Collins route for Reviews
router.post(
    "/:spotId/reviews",
    requireAuth,
    validateReview,
    async (req, res) => {
        const { spotId } = req.params;
        const { review, stars } = req.body;

        try {
            const spot = await Spot.findByPk(spotId);
            if (!spot) {
                return res
                    .status(404)
                    .json({ message: "Spot couldn't be found" });
            }

            const existingReview = await Review.findOne({
                where: {
                    userId: req.user.id,
                    spotId,
                },
            });

            if (existingReview) {
                return res.status(500).json({
                    message: "User already has a review for this spot",
                });
            }

            if (!review || !stars || stars < 1 || stars > 5) {
                return res.status(400).json({
                    message: "Bad Request",
                    errors: {
                        review: "Review text is required",
                        stars: "Stars must be an integer from 1 to 5",
                    },
                });
            }

            const newReview = await Review.create({
                userId: req.user.id,
                spotId,
                review,
                stars,
            });

            res.status(201).json(newReview);
        } catch (err) {
            res.status(500).json({ message: "Failed to create review" });
        }
    }
);

// Route: Add an Image to a Spot by id
// Method: POST
// Path: /api/spots/:spotId/images
// Description: Adds a new image to a specific spot, only if the user is the owner of the spot.
router.post("/:spotId/images", restoreUser, requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;
    try {
        // Fetch the spot to ensure it exists and belongs to the current user (authorization check)
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // Placeholder for authorization check
        // Assuming req.user.id is the logged-in user's ID
        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const newSpotImage = await SpotImage.create({
            spotId,
            url,
            preview,
        });

        res.status(201).json(newSpotImage);
    } catch (err) {
        res.status(400).json({
            message: "Error adding image",
            errors: err.errors,
        });
    }
});

// Route: Delete a Spot Image
// Method: DELETE
// Path: /api/spot-images/:imageId
// Description: Deletes a specific image of a spot. The user must be the owner of the spot.
router.delete("/:imageId", restoreUser, requireAuth, async (req, res) => {
    const { imageId } = req.params;

    try {
        // Find the spot image
        const spotImage = await SpotImage.findByPk(imageId);

        if (!spotImage) {
            return res
                .status(404)
                .json({ message: "Spot Image couldn't be found" });
        }

        // Fetch the associated spot to check ownership
        const spot = await Spot.findByPk(spotImage.spotId);

        // Placeholder for authorization check
        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await spotImage.destroy();
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

module.exports = router;
