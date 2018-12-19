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
            this.setState({
                validJSON: true,
                inEdit: false,
            });
        } else {
            this.setState({
                validJSON: false,
                inEdit: false,
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
                        multiline
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
                            ? <JSONPretty json={JSON.parse(this.state.content)}></JSONPretty>
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
        const cardClass = (!this.props.json || this.state.validJSON) ? classes.card : classes.errCard;
        return (
            <Card className={cardClass}>
                <CardContent>
                    {this.display()}
                    {(!this.props.json || this.state.validJSON)
                        ? null
                        : <Typography variant='caption'>
                            Incorrect JSON format
                          </Typography>
                    }
                </CardContent>
            </Card>
        );
    }
}

JSONCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(JSONCard);