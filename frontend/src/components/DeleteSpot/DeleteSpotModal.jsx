import { useDispatch } from "react-redux";
import { useModal } from "../../context/modal";
import { deleteSpot } from "../../store/spot";

import { useState } from "react";

const DeleteSpot = ({ spotId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const onClickDelete = () => {
        setIsDeleting(true);
        dispatch(deleteSpot(spotId))
            .then(() => closeModal())
            .catch((err) => {
                console.error("Failed to delete the spot:", err);
                setError("Failed to delete the spot. Please try again.");
                setIsDeleting(false);
            });
    };

    const onClickCancel = () => {
        closeModal();
    };

    return (
        <div>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot from the listings?</p>
            {error && <p className="error-message">{error}</p>}
            <div>
                <button
                    onClick={onClickDelete}
                    disabled={isDeleting}
                    style={{
                        backgroundColor: "red",
                        color: "white",
                    }}
                >
                    {isDeleting ? "Deleting..." : "Yes (Delete Spot)"}
                </button>
                <button
                    className="cancel-button"
                    onClick={onClickCancel}
                    style={{
                        backgroundColor: "gray",
                        color: "white",
                    }}
                >
                    No (Keep Spot)
                </button>
            </div>
        </div>
    );
};

export default DeleteSpot;