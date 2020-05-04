import React from 'react';
import { connect } from "react-redux";
import { Transition } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { getContactEntry, showContactsLoading } from "../actions";

class Contact extends React.Component {
    componentDidMount() {
        if (this.props.retrieved) {
            this.props.showContactsLoading();
        }
        let { contact } = this.props.match.params;
        this.props.getContactEntry(contact);
    }

    render() {
        let { contact } = this.props.match.params;
        const { currentContact, retrieved } = this.props;
        return (
            <div className="ui centered grid">
                <div className="row">
                    <div className="eight wide column center aligned" style={{marginTop: '1rem', marginBottom: '1rem'}}>
                        <div className="ui black segment">
                            <div className="ui header">Contact Entry</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="seven wide column">
                        <Transition visible={!retrieved} animation='fade' duration={300}>
                            <div className="wrapper-div-that-disappears">
                                <div className="absolute-position-container loader-container">
                                    {/* <div className="ui active massive text loader" style={{color: 'teal'}}>
                                        <strong>Loading</strong>
                                    </div> */}
                                    <strong>Loading...</strong>
                                </div>
                            </div>
                        </Transition>
                        <Transition visible={retrieved} animation='fade' duration={300}>
                            <div className="absolute-position-container" style={{marginBottom: '150px'}}>
                                <div className="ui list">
                                    <div className="item">
                                        <i className="user icon"></i>
                                        <div className="content">
                                            {currentContact && currentContact.first_name + '' + currentContact.last_name}
                                        </div>
                                    </div>
                                    <div className="item">
                                        <i className="mail icon"></i>
                                        <div className="content">
                                            <a href={`mailto:${currentContact && currentContact.email}`}>{currentContact && currentContact.email}</a>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <i className="phone icon"></i>
                                        <div className="content">
                                            {currentContact && currentContact.phone}
                                        </div>
                                    </div>
                                </div>
                                <Link to={`/contacts/entry/${contact}/edit`} className="ui tiny button primary">Edit</Link> <Link to="/contacts" className="ui tiny button secondary">Return</Link>
                            </div>
                        </Transition>
                    </div>
                </div>   
            </div>
        );
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
)(Contact);