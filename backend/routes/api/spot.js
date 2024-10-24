const express = require('express');
const { Spot } = require("../../db/models"); // Assuming models are in a folder named models
const router = express.Router();
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth')



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

module.exports = router;
