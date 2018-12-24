import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { CardContent, Typography, Divider } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ShowIcon from '@material-ui/icons/Visibility';
import TextField from '@material-ui/core/TextField';

import AttibuteDisplayGrid from './AttDispGrid';
import { ApiUrl } from '../../Utils/config';
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
            attributes: {},
            count: 0,
            level_secret: ''
        }
    }

    componentDidMount = () => {
        const { name } = this.props;
        this.setState({
            levelName: name,
        });

        this.loadLevelInfo(name);
    }

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
        attributes['attribute' + (this.state.count + 1)] = {
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

        delete attributes[id];
        attributes[name] = {
            isJSON: isJSON,
            list: elements,
        };
        this.setState({
            attributes: attributes,
        });
        return true;
    }

    swap(array, idx1, idx2) {
        if (idx1 < 0 || idx2 < 0 || idx1 >= array.length || idx2 >= array.length) return array;
        let elem1 = array[idx1];
        array[idx1] = array[idx2];
        array[idx2] = elem1;
        return array;
    }

    moveCard = (name, offset) => (index) => () => {
        // console.log(this.state.attributes);
        let attributes = this.state.attributes;
        attributes[name].list = this.swap(attributes[name].list, index, index + offset);

        this.setState({
            attributes: attributes,
        });
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        let url = ApiUrl + '/api/level/' + this.state.levelName;
        let body = {
            'attributes': this.state.attributes,
            'level_secret': this.state.level_secret,
        };
        let options = {}
        let token = localStorage.getItem('accessToken') || '';
        options.headers = new Headers({ Accept: 'application/json' });
        options.headers.set('x-auth-token', token);
        options.method = 'PUT'
        options.body = JSON.stringify(body);
        fetchUtils.fetchJson(url, options)
            .then(data => {
                alert(data.json.message);
                this.props.history.push('/level/' + this.state.levelName + '/show');
            })
            .catch((err, ...rest) => {
                alert(err.message);
                this.props.history.push('/level/' + this.state.levelName + '/show');
            });
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.card}>
                <Title title={this.state.levelName + ' Attributes'}></Title>
                <CardContent>
                    <Typography variant='headline'>
                        {this.state.levelName}
                        <Button
                            color="primary"
                            style={{ float: 'right' }}
                            onClick={() => { this.props.history.push('/level/' + this.state.levelName + '/show') }}
                        >
                            <ShowIcon /> &nbsp; Show
                        </Button>
                    </Typography>
                    <Typography variant='caption'>
                        {this.state.subheading}
                    </Typography>
                    {/* <Divider /> */}
                    <TextField
                        id="level-password"
                        type='password'
                        label="Level Password"
                        value={this.state.level_secret}
                        onChange={this.handleChange('level_secret')}
                        margin="normal"
                    />
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
                                        moveLeft={this.moveCard(att.name, -1)}
                                        moveRight={this.moveCard(att.name, 1)}
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
                        <Typography variant='caption' color='error'>
                            * Don't forget to save all the attributes before hitting the final save button!
                        </Typography>
                        <Button
                            label="Save"
                            color='primary'
                            variant="raised"
                            style={{ float: 'left' }}
                            onClick={this.handleSubmit}
                        ><SaveIcon /> &nbsp; Save</Button>
                        <br />
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