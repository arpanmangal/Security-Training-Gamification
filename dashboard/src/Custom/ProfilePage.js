import React from 'react';
import NameCard from '../Cards/NameCard';

class ProfilePage extends React.Component {
    render() {
        console.log(this.props);

        return (
            [
                <NameCard key="header"/>
            ]
        );
    }
}

export default ProfilePage;