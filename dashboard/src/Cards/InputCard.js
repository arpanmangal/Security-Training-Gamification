import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';
import { CardContent, Typography } from '@material-ui/core';
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
import EditIcon from '@material-ui/icons/Edit';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import JSONPretty from 'react-json-pretty';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import GameCard from './GameCard';

import JSONCard from './Attributes/jsonCard';

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

class InputCard extends React.Component {
    constructor() {
        super();

        this.state = {
            isJSON: false,
            name: '',
            elements: {},
            count: 0,
        }
    }

    handleChange = name => event => {
        this.setState({ 'isJSON': event.target.checked });
    };

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
        console.log('adding');
        let elements = this.state.elements;
        elements['' + this.state.count] = '{}';
        this.setState({
            elements: elements,
            count: this.state.count + 1,
        });
        setTimeout(() => {
            console.log(this.state);
        }, 200);
    }

    update = (id) => (content) => {
        let elements = this.state.elements;
        elements[id] = content;
        this.setState({
            elements: elements,
        });
        console.log(id);
    }

    remove = (id) => () => {
        let elements = this.state.elements;
        delete elements[id];
        this.setState({
            elements: elements,
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.card}>
                {/* <Title title={this.props.title}></Title> */}
                <CardContent>
                    <Typography variant='headline'>Passwords</Typography>
                    <FormGroup
                        style={{ float: 'right' }}
                    >
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
                                        <JSONCard json={this.state.isJSON} content={e.val} onsave={this.update(e.id)} ondelete={this.remove(e.id)} />
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
};

export default withStyles(styles)(InputCard);