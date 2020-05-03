import React from 'react';
import { connect } from "react-redux";
import { logOut, fetchUserInfo, trackButtonClick } from "../actions";
import { Link } from "react-router-dom";
import history from '../history';

class Home extends React.Component {
    constructor(props) {
        super(props);
        if (!sessionStorage.getItem('id')) {
            history.push('/');
        } else {
            if (!this.props.loggedIn) {
                let id = sessionStorage.getItem('id');
                let token = sessionStorage.getItem('token');
                this.props.setLoggedIn(id, token);
            }
        }
    }

    componentDidMount() {
        this.props.fetchUserInfo(sessionStorage.getItem('id'));
    }

    onLogOut = () => {
        this.props.logOut();
    }

    openTransactionModal = type => {
        this.props.openTransactionModal(type);
    }

    // className="ui center aligned grid"
    render() {
        return (
            <div className="ui centered grid">
                <div className="ten wide center aligned column" style={{marginTop: '20px'}}>
                    <div className="ui message">
                        <h1><i className="icon user outline"></i> Hello {this.props.name}!</h1>
                        <div>
                            <Link to="/contacts" className="ui button primary">View Contacts</Link> <button onClick={this.onLogOut} className="ui button positive">Log Out</button>
                        </div>
                        <br/>
                        <button className="ui button green" onClick={() => this.props.trackButtonClick(this.props.email)}>Click to Track</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { 
        loggedIn: state.auth.loggedIn,
        token: state.auth.token,
        name: state.user.name,
        email: state.user.email
    };
};

export default connect(
    mapStateToProps,
    { logOut, fetchUserInfo, trackButtonClick }
)(Home);