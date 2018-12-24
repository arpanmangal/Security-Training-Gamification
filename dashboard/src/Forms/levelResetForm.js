import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { fetchUtils, userLogout } from 'react-admin';
import { ApiUrl, PasswordRegex, NameRegex, TextRegex, AlphaNumericRegex } from '../Utils/config';

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
        minHeight: '50vh',
        maxHeight: '90vh',
        minWidth: 500,
        maxWidth: '90vh',
    },
});

class ResetForm extends React.Component {
    constructor() {
        super();
        this.state = {
            fields: {
                password: '',
                newPassword: '',
                confirmPassword: '',
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

    handleReset = event => {
        let fields = {
            password: '',
            newPassword: '',
            confirmPassword: '',
        };
        this.setState({
            fields: fields,
            errors: {}
        });
    }

    handleValidation = () => {
        let fields = this.state.fields || {};
        let errors = {};
        let formIsValid = true;

        // Validate Password
        if (!fields['password'] || fields['password'] === '') {
            errors['password'] = 'This is required';
            formIsValid = false;
        } else if (fields['password'].length < 8 || fields['password'].length > 13) {
            errors['password'] = 'Incorrect Password';
            formIsValid = false;
        } else if (!PasswordRegex.test(fields['password'])) {
            errors['password'] = 'Incorrect Password';
            formIsValid = false;
        } else {
            errors['password'] = null;
        }
        if (!fields['newPassword'] || fields['newPassword'] === '') {
            errors['newPassword'] = 'This is required';
            formIsValid = false;
        } else if (fields['newPassword'].length < 8 || fields['newPassword'].length > 13) {
            errors['newPassword'] = 'Password should be 8-13 characters long';
            formIsValid = false;
        } else if (!PasswordRegex.test(fields['newPassword'])) {
            errors['newPassword'] = 'Password should contain at least one uppercase, one lowercase, one number, and one special character from @$!%*?&';
            formIsValid = false;
        } else {
            errors['newPassword'] = null;
        }
        if (!fields['confirmPassword'] || fields['confirmPassword'] === '') {
            errors['confirmPassword'] = 'This is required';
            formIsValid = false;
        } else if (fields['confirmPassword'] !== fields['newPassword']) {
            errors['confirmPassword'] = 'Passwords do not match';
            formIsValid = false;
        } else {
            errors['confirmPassword'] = null;
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleSubmit = (event) => {
        // Prevent default
        event.preventDefault();

        if (this.handleValidation()) {
            let body = JSON.parse(JSON.stringify(this.state.fields));
            body['old_secret'] = body['password'];
            body['new_secret'] = body['newPassword'];
            body['name'] = this.props.levelName;
            delete body['password'];
            delete body['newPassword'];
            delete body['confirmPassword'];

            let url = ApiUrl + '/api/level/modify_secret';
            let options = {}
            let token = localStorage.getItem('accessToken') || '';
            options.headers = new Headers({ Accept: 'application/json' });
            options.headers.set('x-auth-token', token);
            options.method = 'POST'
            options.body = JSON.stringify(body);
            fetchUtils.fetchJson(url, options)
                .then(data => {
                    alert(data.json.message);
                    window.location.reload();
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
                type="submit"
                key="submit"
                label="Update"
                color='primary'
                variant="raised"
                style={{ float: 'left' }}
            >Update Level Password</Button>,
        ];

        return (
                <form className={classes.container} noValidate onSubmit={this.handleSubmit}>
                    <TextField
                        required
                        id="password"
                        label="Old Level Password"
                        value={this.state.fields["password"]}
                        onChange={this.handleChange('password')}
                        placeholder="old password"
                        className={classes.textField}
                        type="password"
                        margin="normal"
                        variant="outlined"
                        error={this.state.errors["password"] ? true : false}
                        helperText={this.state.errors["password"]}
                    />
                    <br />
                    <TextField
                        required
                        id="newPassword"
                        label="New Level Password"
                        value={this.state.fields["newPassword"]}
                        onChange={this.handleChange('newPassword')}
                        placeholder="new password"
                        className={classes.textField}
                        type="password"
                        margin="normal"
                        variant="outlined"
                        error={this.state.errors["newPassword"] ? true : false}
                        helperText={this.state.errors["newPassword"]}
                    />
                    <br />
                    <TextField
                        required
                        id="confirmPassword"
                        label="Confirm Level Password"
                        value={this.state.fields["confirmPassword"]}
                        onChange={this.handleChange('confirmPassword')}
                        placeholder="confirm password"
                        className={classes.textField}
                        type="password"
                        margin="normal"
                        variant="outlined"
                        error={this.state.errors["confirmPassword"] ? true : false}
                        helperText={this.state.errors["confirmPassword"]}
                    />
                    <br />
                    <div style={{ textAlign: 'left', padding: 4, paddingTop: 20, paddingBottom: 60 }}>
                        {actions}
                    </div>
                </form>
        );
    }
}

ResetForm.propTypes = {
    classes: PropTypes.object.isRequired,
    levelName: PropTypes.string.isRequired,
};

export default withStyles(styles)(ResetForm);