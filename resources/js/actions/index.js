import { 
    LOG_IN, 
    LOG_OUT, 
    FETCH_USER_INFO,
    LOG_IN_FAIL,
    SHOW_MESSAGE,
    HIDE_MESSAGE,
    REGISTER,
    SHOW_FORM_LOADING,
    HIDE_FORM_LOADING,
    ADD_CONTACT,
    GET_CONTACTS,
    SHOW_CONTACTS_LOADING,
    GET_CONTACT_ENTRY,
    EDIT_CONTACT,
    TRACK_BUTTON_CLICKED,
    IMPORT_CONTACTS_CSV,
    IMPORTING_LOADING,
    TRACK_BUTTON_TRACKED,
    LOG_IN_LOADING
} from "./types";
import history from '../history';
import { post } from "axios";

export const setLoggedIn = (id, token) =>  {
    return {
        type: LOG_IN,
        payload: {
            id,
            token
        }
    }
}

export const logIn = (email, password) => async (dispatch) => {
    const user = await axios.post('/login', {email, password});
    if (user.data.success) {
        const id = user.data.id;
        const token = user.data.token;
        const payload = { id, token };
        dispatch({type: LOG_IN, payload});
        sessionStorage.setItem('id', id);
        sessionStorage.setItem('token', token); // for use with api authentication when retrieving user data
        history.push('/home');
    } else {
        dispatch({type: LOG_IN_FAIL});
    }
}

export const logOut = () => async (dispatch) => {
    dispatch({type: LOG_OUT});
    await axios.post('/logout');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('token');
    location.replace('/'); // hard refresh because for someone weird reason laravel isn't liking multiple requests login from SPA
}

export const fetchUserInfo = id => async (dispatch) => {
    const token = sessionStorage.getItem('token');
    const response = await axios.get(`/api/user/${id}?api_token=${token}`);
    let { name, email, bankroll, money_in_play } = response.data;
    const payload = { name, email, bankroll, money_in_play };
    dispatch({type: FETCH_USER_INFO, payload});
}

export const getContacts = page => async dispatch => {
    const token = sessionStorage.getItem('token');
    var url = `/api/contacts?api_token=${token}`;
    if (page) url += `&page=${page}`;
    const res = await axios.get(url);
    dispatch({type: GET_CONTACTS, payload: res.data});
}

export const addContact = data => async dispatch => {
    dispatch({type: SHOW_FORM_LOADING});
    const token = sessionStorage.getItem('token');
    const res = await axios.post(`/api/contacts?api_token=${token}`, data);
    if (res.data.error) {
        let errObj = { type: 'error', header: 'Failed to register', items: res.data.error }
        dispatch({type: SHOW_MESSAGE, payload: errObj});
        dispatch({type: HIDE_FORM_LOADING});
    } else {
        dispatch({type: ADD_CONTACT, payload: res.data});
        dispatch({type: HIDE_FORM_LOADING});        
        history.push('/contacts');
    }
}

export const getContactEntry = id => async dispatch => {
    const token = sessionStorage.getItem('token');
    var url = `/api/contact/${id}?api_token=${token}`;
    const res = await axios.get(url);
    dispatch({type: GET_CONTACT_ENTRY, payload: res.data});
}

export const editContact = (id, data) => async dispatch => {
    const token = sessionStorage.getItem('token');
    var url = `/api/contact/${id}?api_token=${token}`;
    const res = await axios.post(url, data);
    dispatch({type: EDIT_CONTACT, payload: res.data});
    history.push('/contacts');
}

export const showContactsLoading = () => {
    return {
        type: SHOW_CONTACTS_LOADING
    };
}

export const trackButtonClick = email => async dispatch => {
    dispatch({type: TRACK_BUTTON_CLICKED});
    const token = sessionStorage.getItem('token');
    var url = `/api/click?api_token=${token}`;
    const res = await axios.post(url, { email });
    if (res.data == 1) {
        alert('Click tracked with Klaviyo');
    } else {
        alert('Click failed to track with Klaviyo');
    }
    dispatch({type: TRACK_BUTTON_TRACKED});
}

export const importingLoading = () => {
    return {
        type: IMPORTING_LOADING
    };
}

export const importContactsCSV = file => async dispatch => {
    dispatch({type: IMPORTING_LOADING});
    const token = sessionStorage.getItem('token');
    const url = `/api/contacts/uploadFile?api_token=${token}`;
    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    const res = await post(url, formData, config);
    const klaviyoSyncStatus = res.data.klaviyoSyncStatus;
    const importMsg = res.data.status;
    var klaviyoMsg
    if (klaviyoSyncStatus)
        klaviyoMsg = 'Contacts successfully synced with Klaviyo';
    else
        klaviyoMsg = 'Contacts failed to sync with Klaviyo';
    alert(`${importMsg} ${klaviyoMsg}`);
    dispatch({type: IMPORT_CONTACTS_CSV});
}


export const register = data => async dispatch => {
    dispatch({type: SHOW_FORM_LOADING});
    const res = await axios.post('/register', data);
    if (res.data.success) {
        dispatch({type: REGISTER});
    } else {
        let errObj = { type: 'error', header: 'Failed to register', items: res.data.error }
        dispatch({type: SHOW_MESSAGE, payload: errObj});
        dispatch({type: HIDE_FORM_LOADING});
    }
}

export const showMessage = (msgType, header, items) => {
    return {
        type: SHOW_MESSAGE,
        payload: {
            type: msgType,
            header,
            items
        }
    }
}

export const hideMessage = () => {
    return {
        type: HIDE_MESSAGE
    }
}

export const loginLoading = () => {
    return {
        type: LOG_IN_LOADING
    };
}