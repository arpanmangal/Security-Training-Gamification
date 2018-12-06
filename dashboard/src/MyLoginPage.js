import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userLogin, Notification } from 'react-admin';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { fetchUtils } from 'react-admin';
import { ApiUrl } from './config';
import { Link } from 'react-router-dom';

const styles = theme => ({
    container: {
        // display: 'flex',
        // flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    dense: {
        marginTop: 16,
    },
    menu: {
        width: 200,
    },
    dialogPaper: {
        minHeight: '20vh',
        maxHeight: '90vh',
        minWidth: 400,
        maxWidth: '90vh',
        textAlign: 'center'
    },
});

class MyLoginPage extends Component {
    constructor() {
        super();
        this.state = {
            fields: {
                username: '',
                password: '',
            },
            errors: {},
        }
    }

    handleChange = name => event => {
        let fields = this.state.fields;
        let errors = this.state.errors;
        fields[name] = event.target.value;
        delete errors[name];
        this.setState({
            fields: fields,
            errors: errors
        });
    };

    handleValidation = () => {
        let fields = this.state.fields || {};
        let errors = {};
        let formIsValid = true;

        // Validate Username
        if (!fields['username'] || fields['username'] === '') {
            errors['username'] = 'This is required';
            formIsValid = false;
        } else {
            errors['username'] = null;
        }

        // Validate Password
        if (!fields['password'] || fields['password'] === '') {
            errors['password'] = 'This is required';
            formIsValid = false;
        } else {
            errors['password'] = null;
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        // gather your data/credentials here
        const credentials = this.state.fields;

        // Dispatch the userLogin action (injected by connect)
        if (this.handleValidation()) {
            this.props.userLogin(credentials);
        }
        // , function() {
        // alert('hey')
        // })
        // .then(() => {
        //     console.log('hey')
        // })
        // .catch((...rest) => {
        //     // console.log(err.status, err.message);
        //     // alert(err.message);
        //     console.log('err')
        // });
    }

    render() {
        const { classes } = this.props;

        const actions = [
            <Button
                type="submit"
                label="Login"
                color='primary'
                variant="raised"
                style={{ width: 300 }}
            >Login</Button>,
            <br />, <br />,
            <div style={{ textAlign: 'center' }}>
                <Link to={`/signup`} >New Player? Register Here</Link>
                <br /><br />
                <Link to={`/forgot`}>Forgot your Password</Link>
            </div >

        ];

        return (
            <Dialog
                open={true}
                style={{
                    textAlign: "center",
                }}
                onClose={this.handleClose}
                classes={{ paper: classes.dialogPaper }}
            >
                <DialogTitle>Login</DialogTitle>
                <form className={classes.container} noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                    <TextField
                        required
                        id="username"
                        label="Username"
                        value={this.state.fields["username"]}
                        onChange={this.handleChange('username')}
                        placeholder="username"
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        error={this.state.errors["username"] ? true : false}
                        helperText={this.state.errors["username"]}
                    />
                    <br />
                    <TextField
                        required
                        id="password"
                        label="Password"
                        value={this.state.fields["password"]}
                        onChange={this.handleChange('password')}
                        placeholder="password"
                        className={classes.textField}
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                        variant="outlined"
                        error={this.state.errors["password"] ? true : false}
                        helperText={this.state.errors["password"]}
                    />
                    <div style={{ textAlign: 'right', padding: 40 }}>
                        {actions}
                    </div>
                </form>
            </Dialog>

        );
    }
};

MyLoginPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(undefined, { userLogin })(withStyles(styles)(MyLoginPage));
