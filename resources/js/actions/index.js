import { 
    LOG_IN, 
    LOG_OUT, 
    FETCH_USER_INFO,
    SELECT_LEAGUE,
    DESELECT_LEAGUES,
    FETCH_UPCOMING_GAMES, 
    FETCH_COMPLETED_GAMES, 
    FETCH_BETS,
    SELECT_BET,
    SHOW_BET_LOADING,
    PLACE_BET,
    HIDE_BET_MODAL,
    GET_TRANSACTIONS,
    PLACE_TRANSACTION,
    OPEN_SIDEBAR,
    LOG_IN_LOADING,
    CLOSE_OVERLAY,
    SHOW_TRANSACTION_LOADING,
    OPEN_TRANSACTION_MODAL,
    HIDE_TRANSACTION_MODAL,
    LOG_IN_FAIL,
    SHOW_MESSAGE,
    HIDE_MESSAGE,
    REGISTER,
    SHOW_FORM_LOADING,
    HIDE_FORM_LOADING,
    CHANGE_BETS_PAGE,
    CHANGE_TRANSACTIONS_PAGE,
    SEND_RESET_PASSWORD_LINK,
    PASSWORD_LINK_SENT,
    ADD_CONTACT,
    GET_CONTACTS,
    SHOW_CONTACTS_LOADING,
    GET_CONTACT_ENTRY,
    EDIT_CONTACT,
    TRACK_BUTTON_CLICKED
} from "./types";
import history from '../history';

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
    console.log(res);
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
    console.log(res);
    dispatch({type: EDIT_CONTACT, payload: res.data});
    history.push('/contacts');
}

export const showContactsLoading = () => {
    return {
        type: SHOW_CONTACTS_LOADING
    };
}

export const trackButtonClick = email => async dispatch => {
    console.log('clicked!!!');
    const token = sessionStorage.getItem('token');
    var url = `/api/click?api_token=${token}`;
    const res = await axios.post(url, { email });
    console.log(res);
    dispatch({type: TRACK_BUTTON_CLICKED, payload: res.data});
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

export const sendResetPasswordLink = email => async dispatch => {
    dispatch({type: SEND_RESET_PASSWORD_LINK});
    const res = await axios.post('/password/email', { email });
    console.log(res);
    if (res.data.success) {
        let successObj = { type: 'success', header: res.data.message, items: null }
        dispatch({type: PASSWORD_LINK_SENT});
        dispatch({type: SHOW_MESSAGE, payload: successObj});
    } else {
        let errObj = { type: 'error', header: res.data.message, items: null }
        dispatch({type: SHOW_MESSAGE, payload: errObj});
        dispatch({type: HIDE_FORM_LOADING});
    }
}

export const selectLeague = league => {
    return {
        type: SELECT_LEAGUE,
        payload: league
    };
}

export const deselectLeagues = () => {
    return {
        type: DESELECT_LEAGUES
    };
}

export const fetchUpcomingGames = league => async dispatch => {
    const response = await axios.get(`/api/games/${league}/upcoming`);
    let { offSeason } = response.data;
    var payload = { league };
    if (offSeason) {
        payload = {...payload, offSeason};
    } else {
        payload = {...payload, games: response.data};
    }
    dispatch({type: FETCH_UPCOMING_GAMES, payload});
}

export const fetchCompletedGames = league => async dispatch => {
    const response = await axios.get(`/api/games/${league}/completed`);
    dispatch({type: FETCH_COMPLETED_GAMES, payload: {games: response.data, league}});
}

export const fetchBets = page => async dispatch => {
    const token = sessionStorage.getItem('token');
    // const response = {data: ['test message', 'blah']};
    var url = `/api/bets?api_token=${token}`;
    if (page) url += `&page=${page}`;
    const response = await axios.get(url);
    dispatch({type: FETCH_BETS, payload: response.data});
}

export const changeBetsPage = () => {
    return {
        type: CHANGE_BETS_PAGE
    }
}

export const selectBet = bet => {
    return {
        type: SELECT_BET,
        payload: bet
    };
}

export const showBetLoading = () => {
    return {
        type: SHOW_BET_LOADING
    }
}

export const placeBet = data => async dispatch => {
    const token = sessionStorage.getItem('token');
    const response = await axios.post(`/api/bets?api_token=${token}`, data);
    dispatch({type: PLACE_BET, payload: response.data});
}

export const hideBetModal = () => {
    return {
        type: HIDE_BET_MODAL
    }
}

export const getTransactions = page => async dispatch => {
    const token = sessionStorage.getItem('token');
    // const response = await axios.get(`/api/transactions?api_token=${token}`);
    // dispatch({type: GET_TRANSACTIONS, payload: response.data});
    var url = `/api/transactions?api_token=${token}`;
    if (page) url += `&page=${page}`;
    console.log(url);
    const response = await axios.get(url);
    dispatch({type: GET_TRANSACTIONS, payload: response.data});
}

export const changeTransactionsPage = () => {
    return {
        type: CHANGE_TRANSACTIONS_PAGE
    }
}

export const openTransactionModal = transactionType => {
    return {
        type: OPEN_TRANSACTION_MODAL,
        payload: transactionType
    }
}

export const showTransactionLoading = () => {
    return {
        type: SHOW_TRANSACTION_LOADING
    };
}

export const placeTransaction = data => async dispatch => {
    const token = sessionStorage.getItem('token');
    const response = await axios.post(`/api/transactions?api_token=${token}`, data);
    dispatch({type: PLACE_TRANSACTION, payload: response.data});
}

export const hideTransactionModal = () => {
    return {
        type: HIDE_TRANSACTION_MODAL
    }
}

export const openSidebar = () => {
    return {
        type: OPEN_SIDEBAR
    }
}

export const loginLoading = () => {
    return {
        type: LOG_IN_LOADING
    }
}

export const closeOverlay = () => {
    return {
        type: CLOSE_OVERLAY
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