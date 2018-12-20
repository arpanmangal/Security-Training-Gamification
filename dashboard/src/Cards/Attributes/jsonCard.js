import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { CardContent, Typography, Divider } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';

import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import JSONPretty from 'react-json-pretty';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    card: {
        maxWidth: 400,
        backgroundColor: theme.palette.attributes.main,
    },
    errCard: {
        maxWidth: 400,
        backgroundColor: theme.palette.attributeError.main,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
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
        content: 'content',
        validJSON: false,
        inEdit: false,
    }

    componentDidMount() {
        console.log(this.props.content);
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

        if (this.isJSONstr(this.state.content)) {
            const content = (typeof(this.state.content) === 'object') ? this.state.content : JSON.parse(this.state.content);
            console.log(content);
            this.setState({
                validJSON: true,
                inEdit: false,
                content: content,
            });
            this.props.onSave(content);
        } else {
            /* Remember to make inEdit true here if this.props.json is true */
            this.setState({
                validJSON: false,
                inEdit: (this.props.json ? true : false),
            });
            this.props.onSave(this.state.content);
        }

    }

    handleDelete = () => {
        this.props.onDelete();
    }

    handleEdit = () => {
        console.log('editing')
        this.setState({
            inEdit: true,
        });
    }

    handleChange = name => event => {
        this.setState({
            'content': event.target.value,
        });
    }

    isJSONstr = (str) => {
        if (typeof(str) === 'object') return true;
        try {
            let json = JSON.parse(str);
            return (typeof json === 'object' && json !== null && json !== undefined);
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
                        value={typeof(this.state.content) === 'object' ? JSON.stringify(this.state.content) : this.state.content}
                        onChange={this.handleChange()}
                        margin="normal"
                    />
                    <br />
                    <IconButton
                        onClick={this.handleSubmit}
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
                            ? <JSONPretty json={typeof(this.state.content) === 'object' ? this.state.content : JSON.parse(this.state.content)}></JSONPretty>
                            : <p>{typeof(this.state.content) === 'object' ? JSON.stringify(this.state.content) : this.state.content}</p>
                        }
                    </Typography>
                    <Divider />
                    <CardActions className={classes.actions} disableActionSpacing>
                        <IconButton aria-label="Edit" onClick={this.handleEdit}>
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="Delete" onClick={this.handleDelete}>
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
        const cardClass = (!this.props.json || this.state.validJSON) ? classes.card : classes.errCard;
        return (
            <Card className={cardClass}>
                <CardContent>
                    {this.display()}
                    {(!this.props.json || this.state.validJSON)
                        ? null
                        : <Typography variant='caption'>
                            Incorrect JSON format
                            <br />
                            (Hint: Use " " for strings)
                          </Typography>
                    }
                </CardContent>
            </Card>
        );
    }
}

JSONCard.propTypes = {
    classes: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default withStyles(styles)(JSONCard);