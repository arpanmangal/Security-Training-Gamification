import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { fetchUtils } from 'react-admin';
import { ApiUrl, PasswordRegex, NameRegex, TextRegex } from './config';

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
        minHeight: '80vh',
        maxHeight: '90vh',
        minWidth: 500,
        maxWidth: '90vh',
    },
});

class RegAdminForm extends React.Component {
    constructor() {
        super();
        this.state = {
            fields: {
                username: '',
                password: '',
                confirmPassword: '',
                name: '',
                email: '',
                adminSecret: '',
            },
            errors: {},
            securityQuestions: [],
        }
    }

    componentDidMount() { }

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

    handleReset = event => {
        let fields = {
            username: '',
            password: '',
            confirmPassword: '',
            name: '',
            email: '',
            adminSecret: '',
        };
        this.setState({
            fields: fields,
            errors: {}
        });
    }

    handleClose = event => {
        this.props.history.push('/login')
    }

    handleValidation = () => {
        let fields = this.state.fields || {};
        let errors = {};
        let formIsValid = true;
        let emailRegex = new RegExp("^([a-zA-Z0-9_\.\-]+)@([a-zA-Z0-9_\.\-]+)\.([a-zA-Z]{2,5})$");

        // Validate Username
        if (!fields['username'] || fields['username'] === '') {
            errors['username'] = 'This is required';
            formIsValid = false;
        } else if (fields['username'].length < 3) {
            errors['username'] = 'Username should be of minimum 3 characters';
            formIsValid = false;
        } else if (NameRegex.test(fields['username'])) {
            errors['username'] = 'Username should only contain alphanumeric characters';
            formIsValid = false;
        } else {
            errors['username'] = null;
        }

        // Validate Password
        if (!fields['password'] || fields['password'] === '') {
            errors['password'] = 'This is required';
            formIsValid = false;
        } else if (fields['password'].length < 8 || fields['password'].length > 13) {
            errors['password'] = 'Password should be 8-13 characters long';
            formIsValid = false;
        } else if (!PasswordRegex.test(fields['password'])) {
            errors['password'] = 'Password should contain at least one uppercase, one lowercase, one number, and one special character from @$!%*?&';
            formIsValid = false;
        } else {
            errors['password'] = null;
        }
        if (!fields['confirmPassword'] || fields['confirmPassword'] === '') {
            errors['confirmPassword'] = 'This is required';
            formIsValid = false;
        } else if (fields['confirmPassword'] !== fields['password']) {
            errors['confirmPassword'] = 'Passwords do not match';
            formIsValid = false;
        } else {
            errors['confirmPassword'] = null;
        }

        // Validate Admin Secret
        if (!fields['adminSecret'] || fields['adminSecret'] === '') {
            errors['adminSecret'] = 'This is required';
            formIsValid = false;
        } else if (fields['adminSecret'].length < 10) {
            errors['adminSecret'] = 'Admin Secret not of appropriate length';
            formIsValid = false;
        } else {
            errors['adminSecret'] = null;
        }

        // Validate Name
        if (!fields['name'] || fields['name'] === '') {
            errors['name'] = 'This is required';
            formIsValid = false;
        } else if (fields['name'].length < 3) {
            errors['name'] = 'Name should be of minimum 3 characters';
            formIsValid = false;
        } else if (TextRegex.test(fields['name'])) {
            errors['name'] = 'Name should not contain special characters'
        } else {
            errors['name'] = null;
        }

        // Validate Email
        if (!fields['email'] || fields['email'] === '') {
            errors['email'] = 'This is required';
            formIsValid = false;
        } else if (!emailRegex.test(fields['email'])) {
            errors['email'] = 'Enter a valid email';
            formIsValid = false;
        } else {
            errors['email'] = null;
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleSubmit = (event) => {
        // Prevent default
        event.preventDefault();

        if (this.handleValidation()) {
            let body = JSON.parse(JSON.stringify(this.state.fields));
            body['user_id'] = body['username'];
            body['admin_secret'] = body['adminSecret'];
            delete body['username'];
            delete body['adminSecret'];
            delete body['confirmPassword']

            let url = ApiUrl + '/api/user/createAdmin';
            let options = {}
            options.headers = new Headers({ Accept: 'application/json' });
            options.method = 'POST'
            options.body = JSON.stringify(body);
            fetchUtils.fetchJson(url, options)
                .then(data => {
                    alert(data.json.message);
                    this.props.history.push('/login')
                })
                .catch((err, ...rest) => {
                    console.log(err.status, err.message);
                    alert(err.message);
                });
        }
    }

    render() {
        const { classes } = this.props;

        const actions = [
            <Button
                type="reset"
                label="Reset"
                color='secondary'
                onClick={this.handleReset}
                style={{ float: 'left' }}
                variant="flat"
            >Reset</Button>,
            <Button
                label="Cancel"
                color='primary'
                onClick={this.handleClose}
                variant="flat"
            >Cancel</Button>,
            <Button
                type="submit"
                label="Submit"
                color='primary'
                variant="flat"
            >Submit</Button>,
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
                <DialogTitle>Create an Admin Account</DialogTitle>
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
                        id="name"
                        label="Name"
                        value={this.state.fields["name"]}
                        onChange={this.handleChange('name')}
                        placeholder="name"
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        error={this.state.errors["name"] ? true : false}
                        helperText={this.state.errors["name"]}
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
                    <br />
                    <TextField
                        required
                        id="confirmPassword"
                        label="Confirm Password"
                        value={this.state.fields["confirmPassword"]}
                        onChange={this.handleChange('confirmPassword')}
                        placeholder="password"
                        className={classes.textField}
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                        variant="outlined"
                        error={this.state.errors["confirmPassword"] ? true : false}
                        helperText={this.state.errors["confirmPassword"]}
                    />
                    <br />
                    <TextField
                        required
                        id="email"
                        label="Email"
                        value={this.state.fields["email"]}
                        onChange={this.handleChange('email')}
                        className={classes.textField}
                        type="email"
                        name="email"
                        placeholder="email"
                        autoComplete="email"
                        margin="normal"
                        variant="outlined"
                        error={this.state.errors["email"] ? true : false}
                        helperText={this.state.errors["email"]}
                    />
                    <br />
                    <TextField
                        required
                        id="adminSecret"
                        label="Admin Secret"
                        value={this.state.fields["adminSecret"]}
                        onChange={this.handleChange('adminSecret')}
                        placeholder="Admin Secret"
                        className={classes.textField}
                        type="password"
                        margin="normal"
                        variant="outlined"
                        error={this.state.errors["adminSecret"] ? true : false}
                        helperText={this.state.errors["adminSecret"]}
                    />
                    <div style={{ textAlign: 'right', padding: 40 }}>
                        {actions}
                    </div>
                </form>
            </Dialog>
        );
    }
}

RegAdminForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegAdminForm);