import React from 'react';
import NameCard from '../Cards/NameCard';
import Favicon from 'react-favicon';

export default ({ permissions, ...props }) => {
    if (!localStorage.getItem('accessToken')) {
        props.history.push('/login');
    };
    return (
        <span>
            {/* <Favicon url="http://oflisback.github.io/react-favicon/public/img/github.ico" /> */}
            <NameCard note="Welcome to Serious Games." title="Dashboard" />
        </span>
    );
}