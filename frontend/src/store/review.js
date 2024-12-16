import {csrfFetch} from './csrf';

const GET_REVIEWS = 'reviews/GET_REVIEWS';

const getReviews = (reviews) => {
    return {
        type: GET_REVIEWS,
        reviews
    }
}

export const fetchReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
  
    if (response.ok) {
      const { Reviews } = await response.json();
      dispatch(getReviews(Reviews));
    }
};

const initialState = {reviews: []};

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_REVIEWS:
          return { ...state, reviews: action.reviews };
        default : return state;
    }
}

export default reviewsReducer;