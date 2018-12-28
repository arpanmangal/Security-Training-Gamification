import React from 'react';
import NameCard from '../Cards/NameCard';

export default ({ permissions, ...props }) => {
    if (!localStorage.getItem('accessToken')) {
        props.history.push('/login');
    };
    return (
        <span>
            <NameCard note="Welcome to Serious Games." title="Dashboard" />
        </span>
    );
}