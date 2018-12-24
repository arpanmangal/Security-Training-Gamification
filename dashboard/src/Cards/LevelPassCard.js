import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ShowIcon from '@material-ui/icons/Visibility';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import { CardContent, Typography } from '@material-ui/core';
import ResetForm from '../Forms/levelResetForm';
import Divider from '@material-ui/core/Divider';
import { Title } from 'react-admin';

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

class LevelPassCard extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.card}>
                <Title title={'Level: ' + this.props.levelName}></Title>
                <CardContent>
                    <Typography variant='headline'>
                        Change Level Password
                        <Button
                            color="primary"
                            style={{ float: 'right' }}
                            onClick={() => { this.props.history.push('/level/' + this.props.levelName + '/show') }}
                        >
                            <ShowIcon /> &nbsp; Show
                        </Button>
                    </Typography>
                    <Typography component={'span'}>
                        <ResetForm history={this.props.history} levelName={this.props.levelName} />
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

LevelPassCard.propTypes = {
    classes: PropTypes.object.isRequired,
    levelName: PropTypes.string.isRequired,
};

export default withStyles(styles)(LevelPassCard);