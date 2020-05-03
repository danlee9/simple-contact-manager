import React, { Component } from 'react';
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import Login from "./Login";
import Register from './Register';
import Home from './Home';
import Contacts from './Contacts';
import AddContact from './AddContact';
import Contact from './Contact';
import EditContact from './EditContact';
import './App.css';

export default class App extends Component {
    render() {
        return (
            <div>
                <div className="ui container">
                    <Router history={history}>
                        <Route render={({location}) => (
                            <div>
                                <TransitionGroup className="transition-group">  
                                    <CSSTransition key={location.key} timeout={300} classNames='fade'>
                                        <div className="route-section">
                                            <Switch location={location}>                                            
                                                <Route path="/" exact component={Login} />
                                                <Route path="/login" exact component={Login} />
                                                <Route path="/register" exact component={Register} />
                                                <Route path="/home" exact component={Home} />
                                                <Route path="/contacts" exact component={Contacts} />
                                                <Route path="/contacts/entry/:contact" exact component={Contact} />
                                                <Route path="/contacts/entry/:contact/edit" exact component={EditContact} />
                                                <Route path="/contacts/create" exact component={AddContact} />
                                                <Route path="/contacts/:page" exact component={Contacts} />
                                            </Switch>
                                        </div>
                                    </CSSTransition>
                                </TransitionGroup>
                            </div>
                            )}
                        />
                    </Router>
                </div>
            </div>
        )
    }
}