const express = require('express');
const { Spot, Review, User, ReviewImage } = require("../../db/models"); // Assuming models are in a folder named models
const router = express.Router();
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');

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
    check('address')
        .exists({ checkFalsy: true})
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true})
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true})
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true})
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true})
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .exists({ checkFalsy: true})
        .withMessage('Longitude must be within -180 and 180'),
    check('name')
        .exists({ checkFalsy: true})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true})
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true})
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];
// Route: Get all Spots
// Method: GET
// Path: /api/spots
// Description: Fetches all the spots from the database without authentication.
router.get('/', async (req, res) => {
    try {
        const spots = await Spot.findAll();
        res.status(200).json({ Spots: spots });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Route: Get all Spgots owned by the Current User
// Method: GET
// Path: /api/spots/current
// Description: Fetches all spots created by the current authenticated user.
router.get('/current', restoreUser, requireAuth, async (req, res) => {
    // Placeholder for authentication middleware
    // Assume req.user contains the logged-in user
    const userId = req.user.id;

    try {
        const spots = await Spot.findAll({ where: { ownerId: userId } });
        res.status(200).json({ Spots: spots });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Route: Get details of a Spot by id
// Method: GET
// Path: /api/spots/:spotId
// Description: Fetches the details of a specific spot by its ID.
router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }
        res.status(200).json(spot);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Route: Create a Spot
// Method: POST
// Path: /api/spots
// Description: Creates a new spot and returns the created spot data.
router.post('/', requireAuth, validateSpot, async (req, res) => {
    // Placeholder for authentication middleware
    // Assume req.user contains the logged-in user
    const userId = req.user.id;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

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
        res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
});

// Route: Edit a Spot
// Method: PUT
// Path: /api/spots/:spotId
// Description: Updates a specific spot and returns the updated spot.
router.put('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

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
        res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
});

// Route: Delete a Spot
// Method: DELETE
// Path: /api/spots/:spotId
// Description: Deletes a specific spot and returns a success message.
router.delete('/:spotId', async (req, res) => {
    const { spotId } = req.params;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        await spot.destroy();
        res.status(200).json({ message: 'Successfully deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Route: Add an Image to a Spot by id
// Method: POST
// Path: /api/spots/:spotId/images
router.post('/:spotId/images', restoreUser, requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;
    try {
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const newSpotImage = await SpotImage.create({
            spotId,
            url,
            preview,
        });

        res.status(201).json(newSpotImage);
    } catch (err) {
        res.status(400).json({ message: 'Error adding image', errors: err.errors });
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
                    as: "reviewImages",  // Use the alias defined in the association
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
router.post("/:spotId/reviews", requireAuth, validateReview, async (req, res) => {
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

module.exports = router;
