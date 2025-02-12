import { csrfFetch } from './csrf';

const GET_REVIEWS = 'reviews/GET_REVIEWS';
const NEW_REVIEW = 'reviews/NEW_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEWS';


const getReviews = (reviews) => {
    return {
        type: GET_REVIEWS,
        reviews
    }
}

const newReview = (review) => ({
    type: NEW_REVIEW,
    review,
});

const deleteAReview = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId,
});

const updateAReview = (review) => ({
    type: UPDATE_REVIEW,
    review,
});

export const fetchReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const { Reviews } = await response.json();
        dispatch(getReviews(Reviews));
    }
};

export const fetchUserReviews = () => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/current`);

    if (response.ok) {
        const { Reviews } = await response.json();
        dispatch(getReviews(Reviews));
    }
};

export const postReview = (spotId, reviewData) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
    });

    if (response.ok) {
        const review = await response.json();
        dispatch(newReview(review));
    }
};

export const updateReview = (reviewId, reviewData) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
    });

    if (response.ok) {
        const updatedReview = await response.json();
        dispatch(updateAReview(updatedReview));
        return updatedReview;
    } else {
        const NewErrorData = await response.json();
        if (NewErrorData.message) {
            throw new Error(NewErrorData.message);
        } else {
            throw new Error('Failed to update review');
        }
    }
};


export const deleteReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(deleteAReview(reviewId));
    }
};


const initialState = { reviews: [] };

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_REVIEWS:
            return { ...state, reviews: action.reviews };
        case NEW_REVIEW:
            return { ...state, reviews: [action.review, ...state.reviews] };
        case DELETE_REVIEW:
            return { ...state, reviews: state.reviews.filter(review => review.id !== action.reviewId) };
        case UPDATE_REVIEW:
            return {
                ...state,
                reviews: state.reviews.map(review => review.id === action.review.id ? action.review : review),
            };
        default: 
            return state;
    }
}

export default reviewsReducer;