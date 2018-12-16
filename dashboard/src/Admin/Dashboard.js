import React from 'react';
import NameCard from '../Cards/NameCard';
import Favicon from 'react-favicon';

export default ({ permissions }) => (
    <span>
        {/* <Favicon url="http://oflisback.github.io/react-favicon/public/img/github.ico" /> */}
        <NameCard note="Welcome to Serious Games." title="Dashboard" />
    </span>
);