import { red, pink, purple, blue, cyan, teal, lime, yellow, amber, brown } from '@material-ui/core/colors/';

export const darkTheme = {
    palette: {
        type: 'dark', // Switching the dark mode on is a single property value change.
        primary: {
            light: teal[100],
            main: teal[200],
            dark: teal[400]
        },
        attributes: {
            main: brown[600],
        },
    },
};

export const lightTheme = {
    palette: {
        type: 'light',
        secondary: {
            light: '#5f5fc4',
            main: '#283593',
            dark: '#001064',
            contrastText: '#fff',
        },
        error: {
            main: '#E91E63'
        },
        attributes: {
            main: yellow[100]
        },
    },
};