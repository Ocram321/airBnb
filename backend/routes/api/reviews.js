const express = require("express");
const { Review, Spot, User, ReviewImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");

const router = express.Router();

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

// 1. Get all Reviews of the Current User
//removed review from front of route
//Server error
router.get("/current", requireAuth, async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Spot,
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
                        "price",
                    ],
                },
                {
                    model: User,
                    attributes: ["id", "firstName", "lastName"],
                },
                {
                    model: ReviewImage,
                    as: "ReviewImages",
                    attributes: ["id", "url"],
                },
            ],
        });

        res.status(200).json({ Reviews: reviewsWithPreviewImage });

        res.status(200).json({ Reviews: reviews });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// 2. Get all Reviews by a Spot's id
// resource not found
//MOVED THIS ROUTE TO SPOTS TO FIX ISSUE
// router.get("/spots/:spotId/reviews", async (req, res) => {
//     const { spotId } = req.params;

//     try {
//         const spot = await Spot.findByPk(spotId);
//         if (!spot) {
//             return res.status(404).json({ message: "Spot couldn't be found" });
//         }

//         const reviews = await Review.findAll({
//             where: { spotId },
//             include: [
//                 {
//                     model: User,
//                     attributes: ["id", "firstName", "lastName"],
//                 },
//                 {
//                     model: ReviewImage,
//                     attributes: ["id", "url"],
//                 },
//             ],
//         });

//         res.status(200).json({ Reviews: reviews });
//     } catch (err) {
//         res.status(500).json({ message: "Server error" });
//     }
// });

// 3. Create a Review for a Spot based on the Spot's id
//MOVED TO SPOTS ROUTES TO MAKE IT WORK
// router.post(
//     "/spots/:spotId/reviews",
//     requireAuth,
//     validateReview,
//     async (req, res) => {
//         const { spotId } = req.params;
//         const { review, stars } = req.body;

//         try {
//             const spot = await Spot.findByPk(spotId);
//             if (!spot) {
//                 return res
//                     .status(404)
//                     .json({ message: "Spot couldn't be found" });
//             }

//             const existingReview = await Review.findOne({
//                 where: {
//                     userId: req.user.id,
//                     spotId,
//                 },
//             });

//             if (existingReview) {
//                 return res.status(500).json({
//                     message: "User already has a review for this spot",
//                 });
//             }

//             if (!review || !stars || stars < 1 || stars > 5) {
//                 return res.status(400).json({
//                     message: "Bad Request",
//                     errors: {
//                         review: "Review text is required",
//                         stars: "Stars must be an integer from 1 to 5",
//                     },
//                 });
//             }

//             const newReview = await Review.create({
//                 userId: req.user.id,
//                 spotId,
//                 review,
//                 stars,
//             });

//             res.status(201).json(newReview);
//         } catch (err) {
//             res.status(500).json({ message: "Failed to create review" });
//         }
//     }
// );

// 4. Add an Image to a Review based on the Review's id
//I removed the first part of the route, reviews,
//need to be able to create a review as the logged in user to test this
router.post("/:reviewId/images", requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;

    try {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res
                .status(404)
                .json({ message: "Review couldn't be found" });
        }

        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const imageCount = await ReviewImage.count({ where: { reviewId } });
        if (imageCount >= 10) {
            return res.status(403).json({
                message:
                    "Maximum number of images for this resource was reached",
            });
        }

        const newImage = await ReviewImage.create({
            reviewId,
            url,
        });

        res.status(201).json(newImage);
    } catch (err) {
        res.status(500).json({ message: "Failed to add image" });
    }
});

// 5. Edit a Review
//removed review from route as test
router.put("/:reviewId", requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;

    try {
        const existingReview = await Review.findByPk(reviewId);
        if (!existingReview) {
            return res
                .status(404)
                .json({ message: "Review couldn't be found" });
        }

        if (existingReview.userId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
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

        existingReview.review = review;
        existingReview.stars = stars;
        await existingReview.save();

        res.status(200).json(existingReview);
    } catch (err) {
        res.status(500).json({ message: "Failed to update the review" });
    }
});

// 6. Delete a Review
//same test remove review from front of route
router.delete("/:reviewId", requireAuth, async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res
                .status(404)
                .json({ message: "Review couldn't be found" });
        }

        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await review.destroy();
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete the review" });
    }
});

//Delete a Review Image
router.delete(
    "/review-images/:imageId",
    requireAuth,
    async (req, res, next) => {
        const { imageId } = req.params;

        try {
            const reviewImage = await ReviewImage.findByPk(imageId, {
                include: {
                    model: Review,
                    attributes: ["userId"],
                },
            });

            if (!reviewImage) {
                return res.status(404).json({
                    message: "Review Image couldn't be found",
                });
            }

            if (reviewImage.Review.userId !== req.user.id) {
                return res.status(403).json({
                    message:
                        "You are not authorized to delete this review image",
                });
            }

            await reviewImage.destroy();

            return res.status(200).json({
                message: "Successfully deleted",
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
