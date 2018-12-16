import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';
import { CardContent, Typography } from '@material-ui/core';
import { Title } from 'react-admin';
import JSONPretty from 'react-json-pretty';
import { teal } from '@material-ui/core/colors/';

const styles = theme => ({
    card: {
        maxWidth: 400,
        backgroundColor: theme.palette.attributes.main,
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

class AttributeDisplayCard extends React.Component {
    render() {
        const { classes } = this.props;
        const { content } = this.props;
        const { theme } = this.props;
        console.log(theme);

        return (
            <Card className={classes.card} >
                <CardContent>
                    <Typography component={'span'}>
                        <JSONPretty json={content}></JSONPretty>
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

AttributeDisplayCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AttributeDisplayCard);