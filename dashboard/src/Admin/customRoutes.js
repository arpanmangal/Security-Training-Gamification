import React from 'react';
import { Route } from 'react-router-dom';
import SignupForm from '../Forms/signupForm';
import ForgotForm from '../Forms/forgotForm';
import RegAdminForm from '../Forms/regAdminForm';
import ProfilePage from '../Custom/ProfilePage';
import Configuration from '../Configuration/Configuration';
import InputCard from '../Cards/InputCard';

import PropTypes from "prop-types";
import { withRouter } from "react-router";
// import queryString from "query-string";

import AttributeEditCard from '../Cards/AttEditCard';

class Test extends React.Component {
    render() {
        console.log(this.props);
        // const { location, permissions } = this.props;
        // const parsed = queryString.parse(location.search);
        // 
        // console.log(location, parsed, permissions);
        return (
            <h1>Hello</h1>
        )
    }
}
Test.defaultProps = {
    location: PropTypes.object.isRequired
};
const Test1 = withRouter(Test);

const Attribute = ({ match: { params }, ...props }) => {
    console.log(params, props);
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
    // <Route path="/input" component={InputCard} />,
    <Route path="/attributes/:attri" component={Attribute} />,

]; 