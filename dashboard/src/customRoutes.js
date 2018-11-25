import React from 'react';
import { Route } from 'react-router-dom';
import SignupForm from './signupForm';
import ForgotForm from './forgotForm';

export default [
    <Route path="/signup" component={SignupForm} noLayout/>,
    <Route path="/forgot" component={ForgotForm} noLayout/>,
];