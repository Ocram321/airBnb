const express = require("express");
const { Review, ReviewImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");

const router = express.Router();

//Delete a Review Image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
    const { imageId } = req.params;

    try {
        const reviewImage = await ReviewImage.findByPk(imageId, {
            include: {
                model: Review,
                as: "Reviews",
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
                message: "You are not authorized to delete this review image",
            });
        }

        await reviewImage.destroy();

        res.status(200).json({
            message: "Successfully deleted",
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
