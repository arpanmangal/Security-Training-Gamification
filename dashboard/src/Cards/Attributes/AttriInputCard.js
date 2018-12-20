import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { CardContent, Typography } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import JSONCard from './jsonCard';

const styles = theme => ({
    card: {
        maxWidth: 1500,
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

class InputCard extends React.Component {
    constructor() {
        super();

        this.state = {
            isJSON: false,
            name: '',
            elements: {},
            count: 0,
            error: false,
        }
    }

    componentDidMount = () => {
        let elements = {}, count = 0;
        this.props.attributeArray.forEach(attri => {
            elements['' + count] = attri;
            count++;
        });

        this.setState({
            name: this.props.attributeName,
            elements: elements,
            count: count,
            isJSON: this.props.isJSON,
        });
    }

    handleChange = name => event => {
        this.setState({ 'isJSON': event.target.checked, 'error': false });

        // Make all elements as objects if possible
        this.makeObjects();
    };

    handleName = name => event => {
        this.setState({ 'name': event.target.value, 'error': false });
    }

    makeObjects = () => {
        let elements = this.state.elements;
        for (let e in elements) {
            if (typeof(elements[e]) === "string") {
                try {
                    let parsed = JSON.parse(elements[e]);
                    if (parsed !== null || parsed !== undefined) 
                        elements[e] = parsed;
                } catch (e) {

                }
            }
        }

        this.setState({
            elements: elements,
        });
    }

    displayList = () => {
        let list = [];
        for (let e in this.state.elements) {
            list.push({
                id: e,
                val: this.state.elements[e],
            });
        }
        return list;
    }

    add = () => {
        let elements = this.state.elements;
        elements['' + this.state.count] = 'content';
        this.setState({
            elements: elements,
            count: this.state.count + 1,
            error: false,
        });
    }

    update = (id) => (content) => {
        let elements = this.state.elements;
        elements[id] = content;
        this.setState({
            elements: elements,
            error: false,
        });
    }

    remove = (id) => () => {
        let elements = this.state.elements;
        delete elements[id];
        this.setState({
            elements: elements,
            error: false,
        });
    }

    validate = () => {
        if (typeof (this.state.name) !== 'string' || this.state.name.length < 1) return false;
        for (let key in this.state.elements) {
            let e = this.state.elements[key];
            if (this.state.isJSON && typeof (e) !== 'object') return false;
            if (!this.state.isJSON && (typeof (e) === 'string' && e.length < 1)) return false;
        }
        return true;
    }

    handleSubmit = () => {
        if (this.validate()) {
            let list = [];
            for (let e in this.state.elements) {
                list.push(this.state.elements[e]);
            }
            this.props.onSave(this.state.name, list, this.state.isJSON);
        } else {
            this.setState({
                error: true,
            });
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant='headline'>
                        <TextField
                            label="Attribute Name"
                            value={this.state.name}
                            onChange={this.handleName()}
                            margin="normal"
                            value={this.state.name}
                        />
                        <IconButton
                            onClick={this.handleSubmit}
                            color='primary'
                        >
                            <SaveIcon />
                        </IconButton>
                    </Typography>
                    {this.state.error
                        ? <Typography variant='caption' color='error'>
                            *Please check for errors in the form
                          </Typography>
                        : null
                    }
                    <FormGroup
                        style={{ float: 'right' }}
                        row
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    disabled
                                    checked={!this.state.isJSON}
                                    value="isString"
                                />
                            }
                            label="String"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.isJSON}
                                    onChange={this.handleChange('isJSON')}
                                    value="isJSON"
                                />
                            }
                            label="JSON"
                        />
                    </FormGroup>
                    <br />
                    <Typography component='span'>
                        <Grid container spacing={24}>
                            {this.displayList().map(e => {
                                return (
                                    <Grid item key={e.id} >
                                        <JSONCard
                                            json={this.state.isJSON}
                                            content={e.val}
                                            onSave={this.update(e.id)}
                                            onDelete={this.remove(e.id)}
                                        />
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Typography>
                    <br />
                    <Typography paragraph>
                        <Button
                            color="primary"
                            aria-label="Add"
                            className={classes.fab}
                            onClick={this.add}
                            variant='fab'
                            style={{ float: 'right' }}>
                            <AddIcon />
                        </Button>
                        <br /><br />
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

InputCard.propTypes = {
    classes: PropTypes.object.isRequired,
    attributeName: PropTypes.string.isRequired,
    attributeArray: PropTypes.array.isRequired,
    onSave: PropTypes.func.isRequired,
    isJSON: PropTypes.bool.isRequired,
};

export default withStyles(styles)(InputCard);