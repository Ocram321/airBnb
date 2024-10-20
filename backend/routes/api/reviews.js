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
router.get("/spots/:spotId/reviews", async (req, res) => {
    const { spotId } = req.params;
    const reviews = await Review.findAll({
        where: { spotId },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"],
            },
            {
                model: ReviewImage,
                attributes: ["id", "url"],
            },
        ],
    });

    if (!reviews) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    res.json({ Reviews: reviews });
});

//3. Create a Review for a Spot based on the Spot's id
router.post("/", async (req, res) => {
    const { content, rating, userId, productId } = req.body;
    try {
        const newReview = await Review.create({
            content,
            rating,
            userId,
            productId,
        });
        res.status(201).json(newReview);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create review" });
    }
});

//4. Add an Image to a Review based on the Review's id
router.post("/reviews/:reviewId/images", async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body; // Assuming the image URL is provided in the request body
    try {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        const newImage = await ReviewImage.create({
            reviewId,
            url,
        });
        res.status(201).json(newImage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create review image" });
    }
});

//5. Edit a Review
router.put("/reviews/:id", async (req, res) => {
    const { id } = req.params;
    const { content, rating } = req.body;
    try {
        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        review.content = content || review.content;
        review.rating = rating || review.rating;
        await review.save();
        res.json(review);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update the review" });
    }
});

//6. Delete a Review
router.delete("/reviews/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        await review.destroy();
        res.json({ message: "Review deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete the review" });
    }
});
