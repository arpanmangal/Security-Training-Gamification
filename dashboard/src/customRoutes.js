import React from 'react';
import { Route } from 'react-router-dom';
import SignupForm from './signupForm';
import ForgotForm from './forgotForm';
import Foo from './Foo';

export default [
    <Route path="/signup" component={SignupForm} noLayout/>,
    <Route path="/forgot" component={ForgotForm} noLayout/>,
    <Route path="/foo" component={Foo} noLayout/>,
];