import {
    LOG_IN,
    LOG_OUT
} from "../actions/types";

const INITIAL_STATE = {
    loggedIn: null,
    userID: null,
    token: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOG_IN:
            return {
                ...state,
                loggedIn: true,
                userID: action.payload.id,
                token: action.payload.token
            };
        case LOG_OUT:
            return { ...state, loggedIn: false, userID: null };
        default:
            return state;
    }
};
