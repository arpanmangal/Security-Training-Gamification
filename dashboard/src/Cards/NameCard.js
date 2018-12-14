import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';
import { CardContent, Typography } from '@material-ui/core';

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

class NameCard extends React.Component {
    date = () => {
        const monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let d = new Date();
        return weekDays[d.getDay()] + ", " + d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="Avatar" className={classes.avatar}>
                            {localStorage.getItem('userName')[0] || 'A'}
                        </Avatar>
                    }
                    title={localStorage.getItem('userName')}
                    subheader={this.date()}
                />
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

NameCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NameCard);