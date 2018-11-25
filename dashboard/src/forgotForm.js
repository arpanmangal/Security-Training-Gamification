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
import { ApiUrl } from './config';

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

class ForgotForm extends React.Component {
    constructor() {
        super();
        this.state = {
            fields: {
                username: '',
                password: '',
                confirmPassword: '',
                question: '',
                answer: '',
            },
            errors: {},
            securityQuestions: [],
        }
    }

    componentDidMount() {
        this.loadSecurityQuestions();
    }

    loadSecurityQuestions = () => {
        fetch(ApiUrl + '/api/questions')
            .then((response) => {
                if (response.status !== 200) {
                    console.log('Can\'t fetch questions: ' + response.status);
                    return;
                }

                response.json().then((data) => {
                    let questions = [];
                    let fields = this.state.fields;
                    if (!data || !data.data || data.data.length < 1) {

                    } else {
                        data.data.forEach(ques => {
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
    };

    handleReset = event => {
        let fields ={
            username: '',
            password: '',
            confirmPassword: '',
            question: '',
            answer: '',
        };
        if (this.state.securityQuestions.length > 0) {
            fields.question = this.state.securityQuestions[0].value;
        }
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

        // Validate Security Question
        if (!fields['question'] || fields['question'] === '') {
            errors['question'] = 'This is required';
            formIsValid = false;
        } else {
            errors['question'] = null;
        }
        // Validate Security Answer
        if (!fields['answer'] || fields['answer'] === '') {
            errors['answer'] = 'This is required';
            formIsValid = false;
        } else {
            errors['answer'] = null;
        }

        this.setState({ errors: errors });
        return formIsValid;
    }

    handleSubmit = (event) => {
        // Prevent default
        event.preventDefault();
        
        if (this.handleValidation()) {
            let body = JSON.parse(JSON.stringify(this.state.fields));
            body['security_question'] = body['question'];
            body['security_answer'] = body['answer'];
            body['user_id'] = body['username'];
            body['new_password'] = body['password'];
            delete body['question'];
            delete body['answer'];
            delete body['username'];
            delete body['password'];
            delete body['confirmPassword'];

            let url = ApiUrl + '/api/user/forgot';
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
                <DialogTitle>Reset your Password</DialogTitle>
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
                    <br /><br />
                    <TextField
                        required
                        id="securityQuestion"
                        select
                        // label="Question"
                        value={this.state.fields["question"]}
                        className={classes.textField}
                        style={{ width: 400 }}
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
                    <div style={{ textAlign: 'right', padding: 40 }}>
                        {actions}
                    </div>
                </form>
            </Dialog>
        );
    }
}

ForgotForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ForgotForm);