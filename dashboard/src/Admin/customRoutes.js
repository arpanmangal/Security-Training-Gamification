import React from 'react';
import { Route } from 'react-router-dom';
import SignupForm from '../Forms/signupForm';
import ForgotForm from '../Forms/forgotForm';
import RegAdminForm from '../Forms/regAdminForm';
import ProfilePage from '../Custom/ProfilePage';
import Configuration from '../Configuration/Configuration';
import PropTypes from "prop-types";
import AttributeEditCard from '../Cards/Attributes/AttributeEditCard';

const Attribute = ({ match: { params }, ...props }) => {
    return (
        <AttributeEditCard name={params.attri} history={props.history} />
    )
}
Attribute.defaultProps = {
    match: PropTypes.object.isRequired,
}

export default [
    <Route exact path="/signup" component={SignupForm} noLayout />,
    <Route exact path="/forgot" component={ForgotForm} noLayout />,
    <Route exact path="/registerAdmin" component={RegAdminForm} noLayout />,
    <Route exact path="/profile" component={ProfilePage} />,
    <Route exact path="/configuration" component={Configuration} />,
    <Route path="/attributes/:attri" component={Attribute} />,

]; 