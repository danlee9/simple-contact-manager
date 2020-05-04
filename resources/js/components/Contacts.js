import React from 'react';
import { connect } from "react-redux";
import { Transition } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { getContacts, showContactsLoading } from "../actions";

class Contacts extends React.Component {
    componentDidMount() {
        if (this.props.retrieved) {
            this.props.showContactsLoading();
        }
        let { page } = this.props.match.params;
        this.props.getContacts(page);
    }

    renderContacts() {
        if (this.props.contacts.length) {
            return this.props.contacts.map(contact => {
                let dateNumber = Date.parse(contact.updated_at);
                let DateObj = new Date(dateNumber);
                let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                let year = DateObj.getFullYear();
                let month = months[DateObj.getMonth()];
                let date = DateObj.getDate();
                let hour = DateObj.getHours();
                let ampm = 'am';
                if (hour > 12) {
                    hour -= 12;
                    ampm = 'pm';
                } 
                let min = DateObj.getMinutes();
                if (('' + min).length == 1)
                    min = '0' + min;
                let sec = DateObj.getSeconds();
                if (('' + sec).length == 1)
                    sec = '0' + min;
                let lastUpdatedTime = `${month} ${date}, ${year} ${hour}:${min}:${sec}${ampm}`
                
                return (
                    <div className="item" key={contact.id}>
                        <i className="large address book middle aligned icon"></i>
                        <div className="content">
                            <Link to={`/contacts/entry/${contact.id}`} className="header">{`${contact.first_name} ${contact.last_name}`}</Link>
                            <div className="description">Last Updated {lastUpdatedTime}</div>
                        </div>
                    </div>
                );
            });
        } else {
            return <div>No Contacts</div>;
        }
    }

    render() {
        let { retrieved, current_page, last_page} = this.props;
        var leftBtnsDisabled = false;
        var rightBtnsDisabled = false;
        if (current_page == '1')
            leftBtnsDisabled = true;
        if (current_page == last_page)
            rightBtnsDisabled = true;
        return (
            <div className="ui centered grid">
                <div className="row">
                    <div className="eight wide column center aligned" style={{marginTop: '1rem', marginBottom: '1rem'}}>
                        <div className="ui black segment">
                            <div className="ui header">Contacts</div>
                            <div><Link to="/contacts/create" className="ui tiny button primary">Add</Link> <Link to="/home" className="ui tiny button secondary">Home</Link></div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="eight wide column">
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
                                <div className="ui vertically divided two column grid">
                                    <div className="ui relaxed divided list">
                                        {this.renderContacts()}
                                    </div>
                                </div>
                                <div className="ui centered grid">
                                    <div className="row">
                                        <Link to="/contacts" className={`ui blue ${leftBtnsDisabled ? 'disabled' : ''} button`}>
                                            <i className="left chevron icon"></i>
                                        </Link>
                                        <Link to={this.props.prev_page_url} className={`ui blue ${leftBtnsDisabled ? 'disabled' : ''} button`}>Prev</Link>
                                        <Link to={this.props.next_page_url} className={`ui blue ${rightBtnsDisabled ? 'disabled' : ''} button`}>Next</Link>
                                        <Link to={this.props.last_page_url} className={`ui blue ${rightBtnsDisabled ? 'disabled' : ''} button`}>
                                            <i className="right chevron icon"></i>
                                        </Link>
                                    </div>
                                </div>
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
        contacts: state.contacts.contacts,
        retrieved: state.contacts.retrieved,
        first_page_url: state.contacts.first_page_url,
        last_page_url: state.contacts.last_page_url,
        next_page_url: state.contacts.next_page_url,
        prev_page_url: state.contacts.prev_page_url,
        current_page: state.contacts.current_page,
        last_page: state.contacts.last_page
    };
};

export default connect(
    mapStateToProps,
    { getContacts, showContactsLoading }
)(Contacts);