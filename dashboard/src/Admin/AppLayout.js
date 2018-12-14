import React from 'react';
import { AppBar, UserMenu, MenuItemLink, Layout } from 'react-admin';
import SettingsIcon from '@material-ui/icons/Settings';
import ProfileIcon from '@material-ui/icons/Person';

const MyUserMenu = props => (
    <UserMenu {...props}>
        <MenuItemLink
            to="/profile"
            primaryText="Profile"
            leftIcon={<ProfileIcon />}
        />
        <MenuItemLink
            to="/settings"
            primaryText="Settings"
            leftIcon={<SettingsIcon />}
        />
    </UserMenu>
);

const MyAppBar = props => <AppBar {...props} userMenu={<MyUserMenu />} />;

const AppLayout = props => <Layout {...props} appBar={MyAppBar} size={500}/>;

export default AppLayout;