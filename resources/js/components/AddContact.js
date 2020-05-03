import React from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { addContact, showMessage, hideMessage } from "../actions";
import { ADD_CONTACT } from "../actions/types";
import history from '../history';
import { Transition } from "semantic-ui-react";

import ContactForm from './ContactForm';

class AddContact extends React.Component {
    render() {
        return (
            <ContactForm formName="Add Contact" submit={addContact} />
        );
    }
}

const mapStateToProps = state => {
    return { 
        message: state.modules.message,
        formLoading: state.modules.formLoading
    };
};

export default connect(mapStateToProps, { addContact, showMessage, hideMessage })(AddContact);