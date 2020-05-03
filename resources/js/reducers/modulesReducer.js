import {
    OPEN_SIDEBAR,
    LOG_IN_LOADING,
    CLOSE_OVERLAY,
    LOG_IN,
    LOG_OUT,
    LOG_IN_FAIL,
    SHOW_MESSAGE,
    HIDE_MESSAGE,
    REGISTER,
    SHOW_FORM_LOADING,
    HIDE_FORM_LOADING,
    SEND_RESET_PASSWORD_LINK,
    PASSWORD_LINK_SENT
} from "../actions/types";

const INITIAL_STATE = {
    showOverlay: false,
    showSidebar: false,
    showLoading: false,
    message: {
        show: false,
        type: '',
        header: '',
        items: null
    },
    formLoading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case OPEN_SIDEBAR:
            return { ...state, showOverlay: true, showSidebar: true };
        case LOG_IN_LOADING:
        case LOG_OUT:
            return { ...state, showOverlay: true, showLoading: true };
        case LOG_IN:
        case CLOSE_OVERLAY:
            return INITIAL_STATE;
        case LOG_IN_FAIL:
            return { ...INITIAL_STATE, message: {show: true, type: 'error', header: 'Login Failed'} };
        case SHOW_MESSAGE:
            let { type, header, items } = action.payload;
            return { ...state, message: { show: true, type, header, items } };
        case HIDE_MESSAGE:
            let messageCopy = {...state.message};
            messageCopy.show = false;
            return { ...state, message: messageCopy }
        case REGISTER:
            return { ...INITIAL_STATE, message: {show: true, type: 'success', header: 'New User Registered!'}}
        case SEND_RESET_PASSWORD_LINK:
        case SHOW_FORM_LOADING:
            return { ...state, formLoading: true };
        case PASSWORD_LINK_SENT:
        case HIDE_FORM_LOADING:
            return { ...state, formLoading: false };
        default:
            return state;
    }
};
