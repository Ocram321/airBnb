import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateReview } from '../../store/review';
import { useModal } from '../../context/modal';


const UpdateReview = ({ review }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [changedReview, setChangedReview] = useState(review.review);
    const [stars, setStars] = useState(review.stars);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (changedReview.length < 10) {
            newErrors.review = 'Review must be at least 10 characters long.';
        }
        if (stars < 1 || stars > 5) {
            newErrors.stars = 'Stars must be between 1 and 5.';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await dispatch(updateReview(review.id, { review: changedReview, stars }));
            closeModal();
        } catch (err) {
            if (err.message) {
                setErrors({ backend: err.message });
            } else {
                setErrors({ backend: 'An unexpected error occurred.' });
            }
        }
    };


    const handleStarClick = (rating) => {
        setStars(rating);
    };

    return (
        <div>
            <div>How was your stay?</div>
            <form onSubmit={handleSubmit}>
                {errors.backend && <p>{errors.backend}</p>}
                <div >
                    {errors.review && <p>{errors.review}</p>}
                    <textarea
                        value={changedReview}
                        onChange={(e) => setChangedReview(e.target.value)}
                        placeholder="Edit your review here..."
                        required
                    />
                </div>
                <div >
                    {errors.stars && <p >{errors.stars}</p>}
                    <div>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}

                                onClick={() => handleStarClick(star)}
                            >
                                ★
                            </span>
                        ))}
                        <span> stars</span>
                    </div>
                </div>
                <button type="submit" >
                    Update Your Review
                </button>
            </form>
        </div>
    );
};

export default UpdateReview;