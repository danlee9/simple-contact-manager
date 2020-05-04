import React from 'react';
import { connect } from "react-redux";
import { register, showMessage, hideMessage } from "../actions";
import { Link } from "react-router-dom";
import history from '../history';
import { Transition } from "semantic-ui-react";

class Register extends React.Component {
    constructor(props) {
        super(props);
        // if (sessionStorage.getItem('id')) {
        //     history.push('/home');
        // }
        this.state = {
            name: '',
            email: '',
            password: '',
            password_confirmation: ''
        };
        this.props.hideMessage();
    }
    
    onInputChange = e => {
        let { name, value } = e.target;
        this.setState({[name]: value});
    }

    submit = e => {
        e.preventDefault();
        this.props.hideMessage();
        var arr = [];
        let { name, email, password, password_confirmation } = this.state;
        let inputs = { name, email, password, password_confirmation };
        let missingInputs = this.checkRequiredInputs(inputs);
        if (missingInputs) {
            missingInputs.forEach(inputName => {
                arr.push(`The ${inputName} field is required`);
            });
            return this.props.showMessage('error', 'Required Fields', arr);
        }
        this.props.register(inputs);
    }

    trimWhiteSpace() {

    }

    checkRequiredInputs = (inputs) => {
        let regex = /\w/g;
        let inputNames = [];
        for (let input in inputs) {
            if (!inputs[input].match(regex))
                inputNames.push(input);
        }
        if (inputNames.length)
            return inputNames;
        else
            return null;
    }

    hideMessage = () => {
        this.props.hideMessage();
    }

    renderMsgItems(items) {
        if (items) {
            return (
                <ul className="list">
                    {items.map((item, i) => {
                        return <li key={i}>{item}</li>
                    })}
                </ul>
            )
        }
    }

    render() {
        let { message, formLoading } = this.props;
        let { name, email, password, password_confirmation } = this.state;
        return (
            <div className="ui center aligned stackable grid">
                <div className="eight wide column">
                    <form className="ui register small form">
                        <div className="ui raised left aligned segment">
                            <Transition visible={formLoading} animation='fade' duration={500}>
                                <div className="form-overlay">
                                    <div className="form-spinner"></div>
                                </div>
                            </Transition>
                            <div className="ui center aligned grid">
                                <h2 className="ui teal image header" style={{padding: '0.6em'}}>
                                    <div className="content">Register</div>
                                </h2>
                            </div>
                            <div className="required field">
                                <label>Name</label>
                                <input placeholder="Name" value={name} name="name" type="text" onChange={this.onInputChange}/>
                            </div>
                            <div className="required field">
                                <label>E-mail</label>
                                <input placeholder="E-mail" value={email} name="email" type="text" onChange={this.onInputChange}/>
                            </div>
                            <div className="required field">
                                <label>Password</label>
                                <input placeholder="Password" value={password} name="password" type="text" onChange={this.onInputChange}/>
                            </div>
                            <div className="required field">
                                <label>Confirm Password</label>
                                <input placeholder="Confirm Password" value={password_confirmation} name="password_confirmation" type="text" onChange={this.onInputChange}/>
                            </div>
                            <div className="ui two column middle aligned grid">
                                <div className="column">
                                    <div className="ui primary submit button" onClick={this.submit}>Submit</div>
                                </div>
                                <div className="right aligned column"><Link to="/">Back to Home Page</Link></div>
                            </div>
                        </div>
                    </form>
                    <Transition visible={message.show} animation='fade' duration={300}>
                        <div className="wrapper-div-that-disappears">
                            <div className={`ui ${message.type} message`} style={{marginTop: '1em'}}>
                                <i className="close icon" onClick={this.hideMessage}></i>
                                <div className="header">
                                    {message.header}
                                </div>
                                {this.renderMsgItems(message.items)}
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
        message: state.modules.message,
        formLoading: state.modules.formLoading
    };
};

export default connect(mapStateToProps, { register, showMessage, hideMessage })(Register);