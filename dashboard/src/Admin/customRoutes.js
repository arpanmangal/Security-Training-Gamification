import React from 'react';
import { Route } from 'react-router-dom';
import SignupForm from '../Forms/signupForm';
import ForgotForm from '../Forms/forgotForm';
import RegAdminForm from '../Forms/regAdminForm';
import ProfilePage from '../Custom/ProfilePage';
import Configuration from '../Configuration/Configuration';

export default [
    <Route path="/signup" component={SignupForm} noLayout/>,
    <Route path="/forgot" component={ForgotForm} noLayout/>,
    <Route path="/registerAdmin" component={RegAdminForm} noLayout/>,
    <Route path="/profile" component={ProfilePage} />,
    <Route exact path="/configuration" component={Configuration} />,
]; 