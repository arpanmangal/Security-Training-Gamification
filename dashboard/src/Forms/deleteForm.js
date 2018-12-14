import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { fetchUtils } from 'react-admin';
import { ApiUrl, PasswordRegex, NameRegex, TextRegex, AlphaNumericRegex } from '../Utils/config';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import red from '@material-ui/core/colors/red';

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

class DeleteForm extends React.Component {
    constructor() {
        super();
        this.state = {
            checked: false,
        }
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleSubmit = (event) => {
        // Prevent default
        event.preventDefault();

        alert('submitted')

        let body = JSON.parse(JSON.stringify(this.state));

        let url = ApiUrl + '/api/user/delete';
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

    render() {
        const { classes } = this.props;

        const actions = [
            <Button
                type="submit"
                key="submit"
                label="Delete"
                color="secondary"
                variant="raised"
                disabled={this.state.checked ? false : true}
                style={{ float: 'left' }}
            >Delete Account</Button>,
        ];

        return (
            <span>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.checked}
                                onChange={this.handleChange('checked')}
                                value="checked"
                            />
                        }
                        label="I want to Delete my Account"
                    />
                </FormGroup>
                <form noValidate onSubmit={this.handleSubmit}>
                    <div style={{ textAlign: 'left', padding: 4, paddingTop: 10, paddingBottom: 60 }}>
                        {actions}
                    </div>
                </form>
            </span>
        );
    }
}

DeleteForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DeleteForm);