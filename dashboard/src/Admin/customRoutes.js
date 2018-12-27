import React from 'react';
import { Route } from 'react-router-dom';
import SignupForm from '../Forms/signupForm';
import ForgotForm from '../Forms/forgotForm';
import RegAdminForm from '../Forms/regAdminForm';
import ProfilePage from '../Custom/ProfilePage';
import Configuration from '../Configuration/Configuration';
import PropTypes from "prop-types";
import AttributeEditCard from '../Cards/Attributes/AttributeEditCard';
import LevelPassCard from '../Cards/LevelPassCard';
import Leaderboard from '../Cards/Leaderboard/LevelLeaderboard';

const Attribute = ({ match: { params }, ...props }) => {
    return (
        <AttributeEditCard name={params.attri} history={props.history} />
    )
}
Attribute.propTypes = {
    match: PropTypes.object.isRequired,
}

const LevelPassword = ({ match: { params }, ...props }) => {
    return (
        <LevelPassCard levelName={params.name} history={props.history} />
    )
}
LevelPassword.propTypes = {
    match: PropTypes.object.isRequired,
}

const LevelLeaderboard = ({ match: { params }, ...props }) => {
    return (
        <Leaderboard levelName={params.name} />
    )
}

export default [
    <Route exact path="/signup" component={SignupForm} noLayout />,
    <Route exact path="/forgot" component={ForgotForm} noLayout />,
    <Route exact path="/registerAdmin" component={RegAdminForm} noLayout />,
    <Route exact path="/profile" component={ProfilePage} />,
    <Route exact path="/configuration" component={Configuration} />,
    <Route exact path="/attributes/:attri" component={Attribute} />,
    <Route exact path="/levelSecret/:name" component={LevelPassword} />,
    <Route exact path="/leaderboard/:name" component={LevelLeaderboard} />,
]; 