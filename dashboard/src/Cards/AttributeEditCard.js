import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';
import { CardContent, Typography } from '@material-ui/core';
import { Title } from 'react-admin';

const styles = theme => ({
    card: {
        maxWidth: 600,
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
});

class AttributeEditCard extends React.Component {
    constructor() {
        super();
        this.state = {
            attributes: {},
        }
    }

    componentDidMount = () => {
        if (this.props.attributes && this.validAttributes(this.props.attributes)) {
            this.setState({
                attributes: this.props.attributes,
            });
        }
    }

    validAttributes = (attributes) => {
        if (!attributes || typeof (attributes) !== 'object') return false;
        for (let key in attributes) {
            if (!Array.isArray(attributes.key)) return false;
        }
        return true;
    }

    isJSONstr = (str) => {
        try {
            let json = JSON.parse(str);
            return (typeof json === 'object');
        } catch (e) {
            return false;
        }
    }

    dispAttriList = () => {
        let list = [];
        for (let att in this.state.attributes) {
            list.push({
                name: att,
                size: this.state.attributes[att].length,
            });
        }
        return list;
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.card}>
                {/* <Title title={this.props.title}></Title> */}
                {/* <CardHeader
                    avatar={
                        <Avatar aria-label="Avatar" className={classes.avatar}>
                            {localStorage.getItem('userName') ? localStorage.getItem('userName')[0].toUpperCase() : 'A'}
                        </Avatar>
                    }
                    title={localStorage.getItem('userName')}
                    subheader={this.date()}
                /> */}
                <CardContent>
                    {this.dispAttriList().map(a => {
                        return (
                            <span>
                                <Typography variant='headline'>{a.name}</Typography>
                                <Typography variant='display1'>Content Size: {a.size}</Typography>
                            </span>
                        )
                    })}
                </CardContent>
                {this.props.note
                    ? <CardContent>
                        <Typography paragraph>{this.props.note}</Typography>
                        <Typography paragraph>Have fun!!</Typography>
                    </CardContent>
                    : null
                }

            </Card>
        );
    }
}

AttributeEditCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AttributeEditCard);