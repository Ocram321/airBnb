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
const { requireAuth, restoreUser,} = require("../../utils/auth");

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
    check("address").exists({ checkFalsy: true }).withMessage("Street address is required"),
    check("city").exists({ checkFalsy: true }).withMessage("City is required"),
    check("state").exists({ checkFalsy: true }).withMessage("State is required"),
    check("country").exists({ checkFalsy: true }).withMessage("Country is required"),
    check("lat").exists({ checkFalsy: true }).isFloat({ min: -90, max: 90 }).withMessage("Latitude must be within -90 and 90"),
    check("lng").exists({ checkFalsy: true }).isFloat({ min: -180, max: 180 }).withMessage("Longitude must be within -180 and 180"),
    check("name").exists({ checkFalsy: true }).isLength({ max: 50 }).withMessage("Name must be less than 50 characters"),
    check("description").exists({ checkFalsy: true }).withMessage("Description is required"),
    check("price").exists({ checkFalsy: true }).isFloat({ min: 0 }).withMessage("Price per day must be a positive number"),
    handleValidationErrors,
];
// Route: Get all Spots
// Method: GET
// Path: /api/spots
// Description: Fetches all the spots from the database without authentication.
router.get("/", async (req, res) => {
    try {
        const spots = await Spot.findAll({
            include: [
                {
                    model: Review,
                    attributes: [],
                },
                {
                    model: SpotImage,
                    attributes: ["url"],
                    where: { preview: true }, // Only include preview images
                    required: false, // Allow spots with no preview image
                },
            ],
            attributes: {
                include: [
                    // Aggregated avgRating and previewImage for each spot
                    [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
                    [Sequelize.col("SpotImages.url"), "previewImage"]
                ],
            },
            group: ["Spot.id", "SpotImages.id"],
        });

        res.status(200).json({ Spots: spots });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Route: Get all Spgots owned by the Current User
// Method: GET
// Path: /api/spots/current
// Description: Fetches all spots created by the current authenticated user.
router.get("/current", restoreUser, requireAuth, async (req, res) => {
    // Placeholder for authentication middleware
    // Assume req.user contains the logged-in user
    const userId = req.user.id;

    try {
        const spots = await Spot.findAll({
            where: { ownerId: userId },
            include: [
                {
                    model: Review,
                    attributes: [],
                },
                {
                    model: SpotImage,
                    attributes: ["url"],
                    where: { preview: true }, // Only includes the images that are marked as preview
                    required: false, // Allow the spots with no preview image
                },
            ],
            attributes: {
                include: [
                    // Calculate the avgRating for each spot from associated reviews
                    [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
                    // Include previewImage from SpotImages
                    [Sequelize.col("SpotImages.url"), "previewImage"]
                ],
            },
            group: ["Spot.id", "SpotImages.id"], // Group by Spot and SpotImage for the aggregation
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
                lat: spotData.lat,
                lng: spotData.lng,
                name: spotData.name,
                description: spotData.description,
                price: spotData.price,
                createdAt: spotData.createdAt,
                updatedAt: spotData.updatedAt,
                avgRating: spotData.avgRating || null,
                previewImage: spotData.previewImage || null,
            };
        });

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
                    attributes: [
                        // Calculate numReviews and avgStarRating from reviews
                        [Sequelize.fn("COUNT", Sequelize.col("Reviews.id")), "numReviews"],
                        [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgStarRating"]
                    ],
                },
                {
                    model: SpotImage,
                    as: "SpotImages",
                    attributes: ["id", "url", "preview"], // Include image details
                },
                {
                    model: User,
                    as: "Owner",
                    attributes: ["id", "firstName", "lastName"],
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

        // Send the response in the expected format
        res.status(200).json(spot);
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
router.put("/:spotId", async (req, res) => {
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

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        spot.update({
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

        res.status(200).json(spot);
    } catch (err) {
        res.status(400).json({
            message: "Validation error",
            errors: err.errors,
        });
    }
});

// Route: Delete a Spot
// Method: DELETE
// Path: /api/spots/:spotId
// Description: Deletes a specific spot and returns a success message.
router.delete("/:spotId", async (req, res) => {
    const { spotId } = req.params;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
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
