import { FETCH_USER_INFO, TRACK_BUTTON_CLICKED, TRACK_BUTTON_TRACKED } from "../actions/types";

const INITIAL_STATE = {
    name: '',
    email: '',
    trackLoading: false
}

export default (state = INITIAL_STATE, action) => {
    let newState = {...state};
    switch (action.type) {
        case FETCH_USER_INFO:
            return action.payload;
        case TRACK_BUTTON_CLICKED:
            newState.trackLoading = true;
            return newState;
        case TRACK_BUTTON_TRACKED:
            newState.trackLoading = false;
            return newState;
        default:
            return state;
    }
}