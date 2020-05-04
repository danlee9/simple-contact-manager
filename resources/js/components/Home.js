import React from 'react';
import { connect } from "react-redux";
import { logOut, fetchUserInfo, trackButtonClick, importContactsCSV, importingLoading } from "../actions";
import { Link } from "react-router-dom";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            file: null,
            loading: false
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

    onChange = e => {
        this.setState({file: e.target.files[0]});
    }

    onFormSubmit = e => {
        e.preventDefault() // Stop form submit
        let file = this.state.file;
        this.props.importContactsCSV(file);
    }

    // className="ui center aligned grid"
    render() {
        const { loading, trackLoading } = this.props;
        const trackingDisplay = trackLoading ? 'visible' : 'hidden';
        const importingDisplay = loading ? 'visible' : 'hidden';
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
                        <br/>
                        <span style={{visibility: trackingDisplay}}>Loading...</span>
                        <br/>
                        <h3>Import Contacts CSV file</h3>
                        <form onSubmit={this.onFormSubmit}>
                            <input className="ui tiny button grey" type='file' name='file' onChange={this.onChange} />
                            <input className="ui tiny button black" type='submit' name='submit' value='Import' />
                            <br/>
                            <span style={{visibility: importingDisplay}}>Loading...</span>
                        </form>
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
        email: state.user.email,
        loading: state.contacts.importingLoading,
        trackLoading: state.user.trackLoading
    };
};

export default connect(
    mapStateToProps,
    { logOut, fetchUserInfo, trackButtonClick, importContactsCSV, importingLoading }
)(Home);