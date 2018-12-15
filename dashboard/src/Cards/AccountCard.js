import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';
import { CardContent, Typography } from '@material-ui/core';
import ResetForm from '../Forms/resetForm';
import DeleteForm from '../Forms/deleteForm';
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

class AccountCard extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.card}>
                <CardHeader
                    title='Account'
                />
                <Divider />
                <CardContent>
                    <Typography variant='headline'>Change Password</Typography>
                    <Typography component={'span'}>
                        <ResetForm history={this.props.history}/>
                    </Typography>
                    <Divider />
                    <br />
                    <Typography variant='headline'>Delete Account</Typography>
                    <Typography variant='caption'>
                        *Once you delete your account, there is no going back. Please be certain.
                    </Typography>
                    <Typography component={'span'}>
                        <DeleteForm history={this.props.history}/>
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

AccountCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AccountCard);