import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/modal";
import { deleteReview } from "../../store/review";

const DeleteReview = ({ reviewId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        dispatch(deleteReview(reviewId))
            .then(() => closeModal())
            .catch((err) => {
                console.error("Failed to delete the review:", err);
                setError("Failed to delete the review. Please try again.");
                setIsDeleting(false);
            });
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <div >
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            {error && <p className="error-message">{error}</p>}
            <button
                className="delete-button"
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                    backgroundColor: "red",
                    color: "white",
                }}
            >
                {isDeleting ? "Deleting..." : "Yes (Delete Review)"}
            </button>
            <button
                onClick={handleCancel}
                style={{
                    backgroundColor: "gray",
                    color: "white",
                }}
            >
                No (Keep Review)
            </button>
        </div>
    );
};

export default DeleteReview