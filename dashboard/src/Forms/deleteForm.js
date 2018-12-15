import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { fetchUtils } from 'react-admin';
import { ApiUrl } from '../Utils/config';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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
        this.setState({ checked: event.target.checked });
    };

    handleSubmit = (event) => {
        // Prevent default
        event.preventDefault();

        alert('submitted');

        let url = ApiUrl + '/api/user/delete';
        let options = {}
        let token = localStorage.getItem('accessToken') || '';
        options.headers = new Headers({ Accept: 'application/json' });
        options.headers.set('x-auth-token', token);
        options.method = 'POST'
        options.body = JSON.stringify({});
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
                color="default"
                variant="raised"
                disabled={this.state.checked ? false : true}
                style={
                    this.state.checked
                        ? { float: 'left', backgroundColor: 'red', color: 'white' }
                        : { float: 'left' }
                }
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