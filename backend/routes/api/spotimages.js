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
const { requireAuth, restoreUser,} = require("../../utils/auth");
// // Route: Add an Image to a Spot by id
// // Method: POST
// // Path: /api/spots/:spotId/images
// // Description: Adds a new image to a specific spot, only if the user is the owner of the spot.
// router.post('/:spotId/images', restoreUser, requireAuth, async (req, res) => {
//     const { spotId } = req.params;
//     const { url, preview } = req.body;
//     try {
//         // Fetch the spot to ensure it exists and belongs to the current user (authorization check)
//         const spot = await Spot.findByPk(spotId);

//         if (!spot) {
//             return res.status(404).json({ message: "Spot couldn't be found" });
//         }

//         // Placeholder for authorization check
//         // Assuming req.user.id is the logged-in user's ID
//         if (spot.ownerId !== req.user.id) {
//             return res.status(403).json({ message: 'Forbidden' });
//         }

//         const newSpotImage = await SpotImage.create({
//             spotId,
//             url,
//             preview,
//         });

//         res.status(201).json(newSpotImage);
//     } catch (err) {
//         res.status(400).json({ message: 'Error adding image', errors: err.errors });
//     }
// });

// // Route: Delete a Spot Image
// // Method: DELETE
// // Path: /api/spot-images/:imageId
// // Description: Deletes a specific image of a spot. The user must be the owner of the spot.
// router.delete('/:imageId', restoreUser, requireAuth, async (req, res) => {
//     const { imageId } = req.params;

//     try {
//         // Find the spot image
//         const spotImage = await SpotImage.findByPk(imageId);

//         if (!spotImage) {
//             return res.status(404).json({ message: "Spot Image couldn't be found" });
//         }

//         // Fetch the associated spot to check ownership
//         const spot = await Spot.findByPk(spotImage.spotId);

//         // Placeholder for authorization check
//         if (spot.ownerId !== req.user.id) {
//             return res.status(403).json({ message: 'Forbidden' });
//         }

//         await spotImage.destroy();
//         res.status(200).json({ message: 'Successfully deleted' });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

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


// module.exports = router;
