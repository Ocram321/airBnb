import { useState } from "react";
import { useDispatch } from "react-redux";
import { postReview } from '../../store/review'
import { useModal } from '../../context/modal'

const PostReview = ({ spotId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(0);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        if (stars === 0 || review.length < 10) {
            setErrors({
                review: "Review must be at least 10 characters long.",
                stars: "Please provide a star rating."
            });
            return;
        }

        dispatch(postReview(spotId, { review, stars }))
            .then(() => closeModal())
            .catch((err) => {
                const data = err.response?.data;
                if (data && data.errors) setErrors(data.errors);
            });
    };


    const handleStarClick = (rating) => {
        setStars(rating);
    };

    return (
        <div >
            <h2>How was your stay?</h2>
            <form onSubmit={handleSubmit}>
                {errors.review && <p className="error">{errors.review}</p>}
                <textarea
                    placeholder="Leave your review here..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                />
                {errors.stars && <p className="error">{errors.stars}</p>}

                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={star <= stars ? "star selected" : "star"}
                            onClick={() => handleStarClick(star)}
                        >
                        ★
                        </span>
                    ))}
                    Stars
                </div>

                <button type="submit" disabled={review.length < 10 || stars === 0}>
                    Submit Review
                </button>
            </form>
        </div>
    );
};

export default PostReview;