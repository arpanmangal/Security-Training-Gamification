import React from 'react';
import NameCard from '../Cards/NameCard';
import ProfileCard from '../Cards/ProfileCard';
import AccountCard from '../Cards/AccountCard';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { red, blue, pink, green } from '@material-ui/core/colors'

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: {
            main: red.A700
        },
        error: {
            main: red.A700
        }
    },
});

class ProfilePage extends React.Component {
    render() {
        console.log(this.props);

        return (
            <MuiThemeProvider theme={theme}>
                <br />
                <NameCard />
                <br />
                <ProfileCard />
                <br />
                <AccountCard />
                <br />
            </MuiThemeProvider>
        );
    }
}

export default ProfilePage;