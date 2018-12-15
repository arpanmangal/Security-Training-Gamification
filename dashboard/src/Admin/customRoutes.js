import React from 'react';
import { Route } from 'react-router-dom';
import SignupForm from '../Forms/signupForm';
import ForgotForm from '../Forms/forgotForm';
import RegAdminForm from '../Forms/regAdminForm';
import ProfilePage from '../Custom/ProfilePage';
import Configuration from '../Configuration/Configuration';

export default [
    <Route exact path="/signup" component={SignupForm} noLayout/>,
    <Route exact path="/forgot" component={ForgotForm} noLayout/>,
    <Route exact path="/registerAdmin" component={RegAdminForm} noLayout/>,
    <Route exact path="/profile" component={ProfilePage} />,
    <Route exact path="/configuration" component={Configuration} />,
]; 