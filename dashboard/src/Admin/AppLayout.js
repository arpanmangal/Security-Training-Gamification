import React from 'react';
import { AppBar, UserMenu, MenuItemLink, Layout } from 'react-admin';
import SettingsIcon from '@material-ui/icons/Settings';
import ProfileIcon from '@material-ui/icons/Person';
import { connect } from 'react-redux';
import { darkTheme, lightTheme } from '../themes';

const MyUserMenu = props => (
    <UserMenu {...props}>
        <MenuItemLink
            to="/profile"
            primaryText="Profile"
            leftIcon={<ProfileIcon />}
        />
        <MenuItemLink
            to="/configuration"
            primaryText="Configuration"
            leftIcon={<SettingsIcon />}
        />
    </UserMenu>
);

const MyAppBar = props => <AppBar {...props} userMenu={<MyUserMenu />} />;

const AppLayout = props => <Layout {...props} appBar={MyAppBar} size={500}/>;

// export default AppLayout;

export default connect(
    state => ({
        theme: state.theme === 'dark' ? darkTheme : lightTheme,
    }),
    {}
)(AppLayout);