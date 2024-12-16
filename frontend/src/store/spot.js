import { csrfFetch } from "./csrf";

const GET_SPOTS = 'spot/getSpots';
const GET_SPOT_INFO = 'spot/getSpotInfo';
const GET_USER_SPOTS = 'spot/getUserSpots';
const PUT_SPOT = 'spot/putSpot';
const DELETE_SPOT = 'spot/deleteSpot';

const getSpots = (payload) => {
    return {
        type: GET_SPOTS,
        payload
    };
};

const getSpotInfo = (payload) => ({
    type: GET_SPOT_INFO,
    payload
});

const getUserSpots = (payload) => ({
    type: GET_USER_SPOTS,
    payload
})

const putSpot = (payload) => ({
    type: PUT_SPOT,
    payload
});

const undoSpot = (spotId) => ({
    type: DELETE_SPOT,
    spotId
});


export const getAllSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots');
    
    if (res.ok) {
        const data = await res.json();
        dispatch(getSpots(data.Spots));
        return data;
    }
};

export const getInfoById = (spotId) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}`);
        if (res.ok) {
            const data = await res.json();
            dispatch(getSpotInfo(data));
            return data;
        } 
    } catch (error) {
        console.error('Error retrieving spotInfo', error);
        throw error;
    }
};


export const AddSpot = (spotInfo) => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spotInfo),
    });

    if (res.ok) {
        const newSpot = await res.json();
        dispatch(getInfoById(newSpot.id));
        return newSpot;
    } 
}

export const UserSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current');
  
    if (res.ok) {
        const data = await res.json();
        dispatch(getUserSpots(data.Spots)); 
        return data;
    }
}

export const updateSpot = (spotId, updatedSpotData) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSpotData),
    });
  
    if (res.ok) {
        const updatedSpot = await res.json();
        dispatch(putSpot(updatedSpot));
        return updatedSpot;
    } 
}

export const deleteSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
    });
  
    if (res.ok) {
        dispatch(undoSpot(spotId));
    }
}


const initialState = { spots: [], spotInfo: {}, userSpots: []}


const SpotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOTS:
            return {
                ...state,
                spots: action.payload 
            };
        case GET_SPOT_INFO:
            return {
                ...state,
                spotInfo: action.payload
            };
        case GET_USER_SPOTS:
            return {
                ...state,
                userSpots: action.payload,
            };
        case PUT_SPOT:
            return {
                ...state,
                spotInfo: action.payload,
                userSpots: state.userSpots.map(spot =>
                    spot.id === action.payload.id ? action.payload : spot
                ),
                spots: state.spots.map(spot =>
                    spot.id === action.payload.id ? action.payload : spot
                ),
            };
        case DELETE_SPOT:
            return {
                ...state,
                userSpots: state.userSpots.filter(spot => spot.id !== action.spotId),
                spots: state.spots.filter(spot => spot.id !== action.spotId),
            };
        default:
            return state;
    }
};
export default SpotsReducer;