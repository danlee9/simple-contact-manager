import queryString from 'query-string'
import {
    GET_CONTACTS,
    ADD_CONTACT,
    SHOW_CONTACTS_LOADING,
    GET_CONTACT_ENTRY
} from "../actions/types";

const parsePageParameter = (url, path) => {
    const query = url.replace(path, '');
    const values = queryString.parse(query);
    return values.page;
}

const INITIAL_STATE = {
    contacts: [],
    retrieved: false,
    currentContact: null,
    // showTransactionModal: false,
    // transactionType: '',
    // transactionLoading: false,
    // transactionPlaced: false,
    first_page_url: '',
    last_page_url: '',
    next_page_url: '',
    prev_page_url: '',
    current_page: null,
    last_page: null
};

export default (state = INITIAL_STATE, action) => {
    let newState = { ...state };
    switch (action.type) {
        case GET_CONTACTS:
            let { data, first_page_url, last_page_url, next_page_url, prev_page_url, current_page, last_page, path } = action.payload;
            first_page_url = first_page_url ? `/contacts/${parsePageParameter(first_page_url, path)}` : '/';
            last_page_url = last_page_url ? `/contacts/${parsePageParameter(last_page_url, path)}` : '/';
            next_page_url = next_page_url ? `/contacts/${parsePageParameter(next_page_url, path)}` : '/';
            prev_page_url = prev_page_url ? `/contacts/${parsePageParameter(prev_page_url, path)}` : '/';
            newState = {...newState, contacts: data, retrieved: true, first_page_url, last_page_url, next_page_url, prev_page_url, current_page, last_page }
            console.log(newState);
            return newState;
        case ADD_CONTACT:
            newState.contacts.push(action.payload);
            return newState;
        case SHOW_CONTACTS_LOADING:
            newState.retrieved = false;
            return newState;
        case GET_CONTACT_ENTRY:
            newState.currentContact = action.payload;
            newState.retrieved = true;
            return newState;
        // case OPEN_TRANSACTION_MODAL:
        //     return {
        //         ...state,
        //         transactionType: action.payload,
        //         showTransactionModal: true,
        //         transactionPlaced: false
        //     };
        // case SHOW_TRANSACTION_LOADING:
        //     return { ...state, transactionLoading: true };
        // case PLACE_TRANSACTION:
        //     newState.transactions.push(action.payload);
        //     newState.transactionLoading = false;
        //     newState.transactionPlaced = true;
        //     return newState;
        // case PLACE_BET:
        //     let transaction = {
        //         id: action.payload.transaction_id,
        //         user_id: action.payload.user_id,
        //         bet_id: action.payload.id,
        //         type: action.payload.bet_type,
        //         amount: action.payload.wager,
        //         in_play: true,
        //         created_at: action.payload.created_at
        //     };
        //     newState.transactions.push(transaction);
        //     return newState;
        // case HIDE_TRANSACTION_MODAL:
        //     return { ...state, showTransactionModal: false, transactionPlaced: false, transactionLoading: false };
        default:
            return state;
    }
};
