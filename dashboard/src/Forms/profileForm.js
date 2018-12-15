import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { fetchUtils } from 'react-admin';
import { ApiUrl, TextRegex } from '../Utils/config';

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

class ProfileForm extends React.Component {
    constructor() {
        super();
        this.state = {
            fields: {
                username: '',
                name: '',
                email: '',
                university: '',
                age: '',
            },
            errors: {},
        }
    }

    componentDidMount() {
        this.loadUserInfo();
    }

    loadUserInfo = () => {
        let url = ApiUrl + '/api/user/view';
        let options = {}
        let token = localStorage.getItem('accessToken') || '';
        options.headers = new Headers({ Accept: 'application/json' });
        options.headers.set('x-auth-token', token);
        options.method = 'GET'
        fetchUtils.fetchJson(url, options)
            .then(data => {
                console.log('success: ', data.json);
                // alert(data.json.message);
                // window.location.reload();
                const info = data.json.data;
                let fields = {
                    username: info.user_id,
                    name: info.name,
                    email: info.email,
                    university: info.university,
                    age: 20,
                }
                this.setState({
                    fields: fields,
                    errors: {},
                });
            })
            .catch((err, ...rest) => {
                console.log(err.status, err.message);
                alert(err.message);
            });
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
            username: this.state.fields.username,
            name: '',
            email: '',
            university: '',
            age: '',
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
        let emailRegex = new RegExp("^([a-zA-Z0-9_\.\-]+)@([a-zA-Z0-9_\.\-]+)\.([a-zA-Z]{2,5})$");


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

        // Validate University
        if (!fields['university'] || fields['university'] === '') {
            fields['university'] = 'NA';
            errors['university'] = null;
        } else if (TextRegex.test(fields['university'])) {
            errors['university'] = 'University Name should not contain special characters';
            formIsValid = false;
        }

        // Validate Age
        if (!fields['age'] || fields['age'] === '') {
            errors['age'] = 'This is required';
            formIsValid = false;
        } else if (parseInt(fields['age']) <= 0) {
            errors['age'] = 'This should be a positive integer';
            formIsValid = false;
        } else {
            errors['age'] = null;
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleSubmit = (event) => {
        // Prevent default
        event.preventDefault();

        if (this.handleValidation()) {
            let body = JSON.parse(JSON.stringify(this.state.fields));
            delete body['username'];
            console.log(body);

            let url = ApiUrl + '/api/user/update';
            let options = {}
            let token = localStorage.getItem('accessToken') || '';
            options.headers = new Headers({ Accept: 'application/json' });
            options.headers.set('x-auth-token', token);
            options.method = 'POST'
            options.body = JSON.stringify(body);
            fetchUtils.fetchJson(url, options)
                .then(data => {
                    localStorage.setItem('userName', data.json.data.name);
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
                label="Save"
                color='primary'
                variant="raised"
                style={{ float: 'left' }}
            >Update Profile</Button>,
        ];

        return (
            <form className={classes.container} noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                <TextField
                    disabled
                    id="username"
                    label="Username"
                    value={this.state.fields["username"]}
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
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
                    id="university"
                    label="University"
                    value={this.state.fields["university"]}
                    onChange={this.handleChange('university')}
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                />
                <br />
                <TextField
                    required
                    id="number"
                    label="Age"
                    value={this.state.fields["age"]}
                    onChange={this.handleChange('age')}
                    type="number"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                    error={this.state.errors["age"] ? true : false}
                    helperText={this.state.errors["age"]}
                />
                <br />
                <div style={{ textAlign: 'left', padding: 4, paddingTop: 20, paddingBottom: 60 }}>
                    {actions}
                </div>
            </form>
        );
    }
}

ProfileForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileForm);