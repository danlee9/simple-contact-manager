import React from "react";
import { connect } from "react-redux";
import { logIn, loginLoading, hideMessage } from "../actions";
import { Link } from "react-router-dom";
import "./Login.css";
import history from '../history';
import { Transition } from "semantic-ui-react";

class Login extends React.Component {
    constructor(props) {
        super(props);
        if (sessionStorage.getItem('id')) {
            history.push('/home');
        }
        this.state = {
            email: '',
            password: ''
        };
        this.props.hideMessage();
    }

    onInputChange = e => {
        let { name, value } = e.target;
        this.setState({ [name]: value}); // make sure to set input name correctly
    }

    onLogin = e => {
        e.preventDefault();
        let {email, password} = this.state;
        this.props.loginLoading();
        this.props.logIn(email, password);
    }

    hideMessage = () => {
        this.props.hideMessage();
    }

    render() {
        let { message } = this.props;
        return (
            <div className="ui center aligned grid">
                <div className="column login">
                    <h2 className="ui teal login-header image header">
                        <div className="content">Simple Contact Manager</div>
                    </h2>
                    <form className="ui large form">
                        <div className="ui raised segment dodgerblue">
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="user icon"></i>
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="E-mail address"
                                        value={this.state.email}
                                        onChange={this.onInputChange}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui left icon input">
                                    <i className="lock icon"></i>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={this.state.password}
                                        onChange={this.onInputChange}
                                    />
                                </div>
                            </div>
                            <button className="ui fluid large teal submit button" onClick={this.onLogin}>
                                Login
                            </button>
                        </div>
                    </form>
                    <div className="ui message">
                        New to us? <Link to="/register">Sign Up</Link>
                    </div>
                    <Transition visible={message.show} animation='fade' duration={300}>
                        <div className="wrapper-div-that-disappears">
                            <div className={`ui ${message.type} message`}>
                                <i className="close icon" onClick={this.hideMessage}></i>
                                <div className="header">
                                    {message.header}
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { 
        message: state.modules.message
    };
};

export default connect(
    mapStateToProps,
    { logIn, loginLoading, hideMessage }
)(Login);

