import React from 'react';
import PropTypes from 'prop-types';
import NameCard from '../Cards/NameCard';
import ProfileCard from '../Cards/ProfileCard';
import AccountCard from '../Cards/AccountCard';

class ProfilePage extends React.Component {
    render() {
        return (
            <span>
                <br />
                <NameCard title="Profile"/>
                <br />
                <ProfileCard history={this.props.history}/>
                <br />
                <AccountCard history={this.props.history}/>
                <br />
            </span>
        );
    }
}

export default ProfilePage;

