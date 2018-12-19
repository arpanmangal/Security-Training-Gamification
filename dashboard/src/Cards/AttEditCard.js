import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';
import { CardContent, Typography, Divider } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import JSONCard from './Attributes/jsonCard';
import AttibuteDisplayGrid from './AttDispGrid';
import { ApiUrl } from '../Utils/config';
import { fetchUtils, Title } from 'react-admin';


const styles = theme => ({
    card: {
        maxWidth: 1500,
        minHeight: 400,
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

class AttributeEditCard extends React.Component {
    constructor() {
        super();

        this.state = {
            levelName: '',
            subheading: '',
            attributes: [],
            count: 0,
        }
    }

    componentDidMount = () => {
        const { name } = this.props;
        this.setState({
            levelName: name,
        });

        this.loadLevelInfo(name);
    }

    // handleChange = name => event => {
    //     this.setState({ 'isJSON': event.target.checked, 'error': false });
    // };

    loadLevelInfo = (name) => {
        let url = ApiUrl + '/api/level/' + name;
        let options = {}
        let token = localStorage.getItem('accessToken') || '';
        options.headers = new Headers({ Accept: 'application/json' });
        options.headers.set('x-auth-token', token);
        options.method = 'GET'
        fetchUtils.fetchJson(url, options)
            .then(data => {
                const info = data.json.data;
                this.setAttributes(info.attributes);
                this.setState({
                    subheading: info.subheading,
                });
            })
            .catch((err, ...rest) => {
                alert(err.message);
                this.props.history.push('/level');
            });
    }

    setAttributes = (attributes) => {
        if (!attributes || typeof (attributes) !== 'object') attributes = {};

        this.setState({
            attributes: attributes,
            count: Object.keys(attributes).length,
        });

        return;
    }

    dispAttriArray = () => {
        let attributes = [];
        for (let key in this.state.attributes) {
            attributes.push({
                name: key,
                isJSON: this.state.attributes[key]['isJSON'],
                value: this.state.attributes[key]['list'],
            });
        }
        return attributes;
    }

    addAttribute = () => {
        let attributes = this.state.attributes;
        attributes['attribute' + this.state.count] = {
            isJSON: false,
            list: [],
        };
        this.setState({
            count: this.state.count + 1,
            attributes: attributes,
        });
    }

    deleteAttribute = (id) => () => {
        let attributes = this.state.attributes;
        delete attributes[id];
        this.setState({
            attributes: attributes,
        });
    }

    updateAttribute = (id) => (name, isJSON, elements) => {
        let attributes = this.state.attributes;
        if ((id !== name && name in attributes) || !Array.isArray(elements))
            return false;

        attributes[name] = {
            isJSON: isJSON,
            list: elements,
        }
        this.setState({
            attributes: attributes,
        });
        return true;
    }

    render() {
        const { classes } = this.props;

        console.log(this.state);
        return (
            <Card className={classes.card}>
                <Title title={this.state.levelName + ' Attributes'}></Title>
                <CardContent>
                    <Typography variant='headline'>
                        {this.state.levelName}
                    </Typography>
                    <Typography variant='caption'>
                        {this.state.subheading}
                    </Typography>
                    <Divider />
                    <br />
                    <Typography paragraph component={'span'}>
                        {this.dispAttriArray().map((att, idx) => {
                            return (
                                <span key={idx}>
                                    <AttibuteDisplayGrid
                                        name={att.name}
                                        isJSON={att.isJSON}
                                        attributes={att.value}
                                        showOnly={false}
                                        onDelete={this.deleteAttribute(att.name)}
                                        onUpdate={this.updateAttribute(att.name)}
                                    />
                                    <br />
                                </span>
                            )
                        })}
                    </Typography>
                    <br />
                    <Typography paragraph>
                        <Button
                            color="primary"
                            aria-label="Add"
                            className={classes.fab}
                            onClick={this.addAttribute}
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

AttributeEditCard.propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
};

export default withStyles(styles)(AttributeEditCard);