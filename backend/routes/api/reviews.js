//backend/routes/api/reviews.js
const express = require("express");
const { Review, Spot, User, ReviewImage } = require("../../db/models");
const { requireAuth } = require("../../utils");
const router = express.Router();

//1. Get all Reviews of Current User
router.get("/current", requireAuth, async (req, res) => {
    const reviews = await Review.findAll({
        where: { userId: req.user.id },
        include: [
            {
                model: Spot,
                attributes: ["id", "ownerId", "address", "city", "name"],
            },
            {
                model: ReviewImage,
                attributes: ["id", "url"],
            },
        ],
    });
    res.json({ Reviews: reviews });
});

//2. Get all Reviews by a Spot's id

//3. Create a Review for a Spot based on the Spot's id

//4. Add an Image to a Review based on the Review's id

//5. Edit a Review

//6. Delete a Review
