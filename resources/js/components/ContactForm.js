import React from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { addContact, editContact, showMessage, hideMessage } from "../actions";
import { Transition } from "semantic-ui-react";

class ContactForm extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
        if (props.first_name) {
            this.state = {
                first_name: props.first_name,
                last_name: props.last_name,
                email: props.email,
                phone: props.phone
            };
        } else {
            this.state = {
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
            };
        }
        this.props.hideMessage();
    }

    componentDidMount() {
        // this.props.fetchUserInfo(sessionStorage.getItem('id'));
    }
    
    onInputChange = e => {
        let { name, value } = e.target;
        this.setState({[name]: value});
    }

    submit = e => {
        e.preventDefault();
        this.props.hideMessage();
        var arr = [];
        let { first_name, last_name, email, phone } = this.state;
        let inputs = { first_name, last_name, email, phone };
        let missingInputs = this.checkRequiredInputs(inputs);
        if (missingInputs) {
            missingInputs.forEach(inputName => {
                arr.push(`The ${inputName} field is required`);
            });
            return this.props.showMessage('error', 'Required Fields', arr);
        }
        console.log('hellllooooo')
        console.log(this.state);
        let { contact } = this.props;
        if (this.props.formName == 'Add Contact')
            this.props.addContact(inputs);
        else
            this.props.editContact(contact, inputs);
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
        let { message, formLoading, formName } = this.props;
        let { first_name, last_name, email, phone } = this.state;
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
                                <h2 className="ui teal image header" style={{paddingTop: '0.6em'}}>
                                    <div className="content">{this.props.formName}</div>
                                </h2>
                            </div>
                            <div className="required field">
                                <label>First Name</label>
                                <input placeholder="Name" value={first_name} name="first_name" type="text" onChange={this.onInputChange}/>
                            </div>
                            <div className="required field">
                                <label>Last Name</label>
                                <input placeholder="Name" value={last_name} name="last_name" type="text" onChange={this.onInputChange}/>
                            </div>
                            <div className="required field">
                                <label>E-mail</label>
                                <input placeholder="E-mail" value={email} name="email" type="text" onChange={this.onInputChange}/>
                            </div>
                            <div className="required field">
                                <label>Phone</label>
                                <input placeholder="Phone" value={phone} name="phone" type="text" onChange={this.onInputChange}/>
                            </div>
                            <div className="ui two column middle aligned grid">
                                <div className="column">
                                    <div className="ui primary submit button" onClick={this.submit}>{formName == 'Add Contact' ? 'Submit' : 'Update'}</div>
                                </div>
                                <div className="right aligned column"><Link to="/contacts">Back to Contacts</Link></div>
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

export default connect(mapStateToProps, { addContact, editContact, showMessage, hideMessage })(ContactForm);