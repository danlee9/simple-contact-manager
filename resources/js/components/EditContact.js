import React from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { addContact, showMessage, hideMessage, getContactEntry, showContactsLoading, editContact } from "../actions";
import { EDIT_CONTACT } from "../actions/types";
import history from '../history';
import { Transition } from "semantic-ui-react";

import ContactForm from './ContactForm';

class EditContact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
        };
        // this.props.hideMessage();
    }

    componentDidMount() {
        let { contact } = this.props.match.params;
        this.props.getContactEntry(contact);
    }

    render() {
        let { first_name, last_name, email, phone } = this.props.currentContact;
        let { contact } = this.props.match.params;
        if (this.props.retrieved) {
            return (
                <ContactForm formName="Edit Contact" first_name={first_name} last_name={last_name} email={email} phone={phone} contact={contact} submit={editContact} />
            );
        } else {
            return (
                <div className="ui centered grid">
                    <div className="row">
                        <div className="eight wide column center aligned" style={{marginTop: '1rem', marginBottom: '1rem'}}>
                            <div className="ui teal header">Loading...</div>
                        </div>
                    </div>
                </div>
            )
        }
        
    }
}

const mapStateToProps = state => {
    return { 
        currentContact: state.contacts.currentContact,
        retrieved: state.contacts.retrieved
    };
};

export default connect(
    mapStateToProps,
    { getContactEntry, showContactsLoading }
)(EditContact);