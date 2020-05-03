import { FETCH_USER_INFO, TRACK_BUTTON_CLICKED } from "../actions/types";

const INITIAL_STATE = {
    name: '',
    email: '',
    time: null
}

export default (state = INITIAL_STATE, action) => {
    let newState = {...state};
    switch (action.type) {
        case FETCH_USER_INFO:
            return action.payload;
        case TRACK_BUTTON_CLICKED:
            newState.time = Date.now();
            return newState;
        default:
            return state;
    }
}