import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';
import { CardContent, Typography } from '@material-ui/core';
import ProfileForm from '../Forms/profileForm';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
    card: {
        maxWidth: 1000,
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

class NameCard extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.card}>
                <CardHeader
                    title='Public Profile'
                />
                <Divider />
                <CardContent>
                    <Typography component={'span'}>
                        <ProfileForm />
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

NameCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NameCard);