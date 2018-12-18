import React from 'react';
import NameCard from '../Cards/NameCard';
import ProfileCard from '../Cards/ProfileCard';
import AccountCard from '../Cards/AccountCard';

class ProfilePage extends React.Component {
    constructor() {
        super();
    }

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

