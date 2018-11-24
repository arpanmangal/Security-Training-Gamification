import React from 'react';
import { Route } from 'react-router-dom';
// import Signup from './signUp';
import SignupForm from './signupForm';

export default [
    <Route exact path="/signup" component={SignupForm} noLayout/>,
];