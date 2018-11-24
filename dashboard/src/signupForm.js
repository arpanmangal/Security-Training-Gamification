import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import RaisedButton from '@material-ui/core/Button'
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
});

class SignupForm extends React.Component {
    constructor() {
        super();
        this.state = {
            fields: {
                username: '',
                password: '',
                confirmPassword: '',
                name: '',
                email: '',
                university: '',
                age: '',
                question: '',
                answer: '', 
            },
            errors: {},
            securityQuestions: [],
        }
    }

    componentDidMount() {
        console.log('yay component mounted');
        this.loadSecurityQuestions();
    }

    loadSecurityQuestions = () => {
        fetch('http://localhost:5380/api/questions')
            .then((response) => {
                if (response.status !== 200) {
                    console.log('Can\'t fetch questions: ' + response.status);
                    return;
                }

                response.json().then((data) => {
                    console.log(data);
                    console.log(data.data);
                    let questions = [];
                    let fields = this.state.fields;
                    if (!data || !data.data || data.data.length < 1) {

                    } else {
                        data.data.forEach(ques => {
                            console.log(ques);
                            questions.push({
                                value: ques.id,
                                label: ques.content
                            });
                        });
                        fields['question'] = data.data[0].id;
                    }
                    this.setState({
                        fields: fields,
                        securityQuestions: questions
                    })
                    console.log(this.state);
                })
            }
            )
            .catch((err) => {
                console.log('Fetch Error: -S', err);
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
        console.log(this.state);
    };

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
        } else {
            errors['username'] = null;
        }

        // Validate Password
        console.log(fields['password']);
        if (!fields['password'] || fields['password'] === '') {
            errors['password'] = 'This is required';
            formIsValid = false;
        } else if (fields['password'].length < 6) {
            errors['password'] = 'Password should be of minimum 6 characters';
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

        // Validate Name
        if (!fields['name'] || fields['name'] === '') {
            errors['name'] = 'This is required';
            formIsValid = false;
        } else if (fields['name'].length < 3) {
            errors['name'] = 'Password should be of minimum 3 characters';
            formIsValid = false;
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
        }

        // Validate Age
        if (!fields['age'] || fields['age'] === '') {
            errors['age'] = 'This is required';
        } else {
            errors['age'] = null;
        }

        // Validate Security Answer
        if (!fields['answer'] || fields['answer'] === '') {
            errors['answer'] = 'This is required';
        } else {
            errors['answer'] = null;
        }

        this.setState({ errors: errors });
        console.log(this.state);
        return formIsValid;
    }

    handleSubmit = (event) => {
        // Prevent default
        // event.preventDefault();
        // console.log(event);
        // console.log(event.target);
        console.log(this.state);
        if (this.handleValidation()) {
            alert(JSON.stringify(this.state));
        }
    }

    // handleName = (event, name) => {
    //     console.log(name, event.target.value, event);
    // }

    render() {
        const { classes } = this.props;

        return (
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
                <br /><br />
                <TextField
                    required
                    id="securityQuestion"
                    select
                    // label="Question"
                    value={this.state.fields["question"]}
                    className={classes.textField}
                    style={{width: 400}}
                    onChange={this.handleChange('question')}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    helperText="Please select a security question"
                    margin="normal"
                    variant="outlined"
                    error={this.state.errors["question"] ? true : false}
                >
                    {this.state.securityQuestions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <br />
                <TextField
                    required
                    id="securityAnswer"
                    label="Answer"
                    value={this.state.fields["answer"]}
                    className={classes.textField}
                    onChange={this.handleChange('answer')}
                    margin="normal"
                    variant="outlined"
                    error={this.state.errors["answer"] ? true : false}
                    helperText={this.state.errors["answer"]}
                />
                <br /><br /><br />
                <RaisedButton variant="raised" label="Register" type="submit"> Register </RaisedButton>
            </form>
        );
    }
}

SignupForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignupForm);