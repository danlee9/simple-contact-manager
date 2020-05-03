import { combineReducers } from "redux";
import authReducer from './authReducer';
import userReducer from './userReducer';
import modulesReducer from './modulesReducer';
import contactsReducer from './contactsReducer';

export default combineReducers({
    auth: authReducer,
    user: userReducer,
    modules: modulesReducer,
    contacts: contactsReducer
});