import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';
import { CardContent, Typography, Divider } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import { Title } from 'react-admin';
import { Field } from 'redux-form';
import { Edit, SimpleForm } from 'react-admin';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
// import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import JSONPretty from 'react-json-pretty';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    card: {
        maxWidth: 500,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    avatar: {
        backgroundColor: green[500],
    },
    fab: {
        margin: theme.spacing.unit,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
});

class JSONCard extends React.Component {
    state = {
        content: '',
        validJSON: true,
        inEdit: false,
    }

    componentDidMount() {
        console.log('Mounted!: ', this.props.content);

        this.setState({
            content: this.props.content,
        });

        if (this.isJSONstr(this.props.content)) {
            this.setState({
                validJSON: true,
            });
        } else {
            this.setState({
                validJSON: false,
            });
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            inEdit: false,
        });

        if (this.isJSONstr(this.state.content)) {
            this.setState({
                validJSON: true,
            });
        } else {
            this.setState({
                validJSON: false,
            });
        }

        this.props.onsave(this.state.content);
    }

    onDelete = () => {
        this.props.ondelete();
    }

    onEdit = () => {
        console.log('editing')
        this.setState({
            inEdit: true,
        });
        setTimeout(() => {
            console.log(this.state);
        }, 200);
    }

    handleChange = name => event => {
        this.setState({
            'content': event.target.value,
        });
    }

    isJSONstr = (str) => {
        try {
            let json = JSON.parse(str);
            return (typeof json === 'object');
        } catch (e) {
            return false;
        }
    }

    display = () => {
        const { classes } = this.props;

        if (this.state.inEdit) {
            return (
                <form noValidate>
                    <TextField
                        label="Content"
                        value={this.state.content}
                        onChange={this.handleChange()}
                        margin="normal"
                    />
                    <br />
                    <IconButton
                        color="primary"
                        onClick={this.handleSubmit}
                    // variant="raised"
                    >
                        <SaveIcon />
                    </IconButton>
                </form>
            );
        } else {
            return (
                <span>
                    <Typography component={'span'} style={{ backgroundColor: 'primary' }}>
                        {(this.props.json && this.state.validJSON)
                            ? <JSONPretty json={this.state.content}></JSONPretty>
                            : <p>{this.state.content}</p>
                        }
                    </Typography>
                    <Divider />
                    <CardActions className={classes.actions} disableActionSpacing>
                        <IconButton aria-label="Edit" onClick={this.onEdit}>
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="Delete" onClick={this.onDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </CardActions>
                </span>
            );
        }
    }

    render() {
        const { classes } = this.props;
        const style = (!this.props.json || this.state.validJSON) ? {} : { backgroundColor: '#00ff00' };
        console.log(this.state, this.props);
        return (
            <Card className={classes.card} style={style}>
                <CardContent>
                    {this.display()}
                </CardContent>
            </Card>
        );
    }
}

JSONCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(JSONCard);