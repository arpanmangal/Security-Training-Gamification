import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AttibuteDisplayCard from './AttDispCard';
import { Title } from 'react-admin';
import Card from '@material-ui/core/Card';
import { CardContent, Typography } from '@material-ui/core';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

class AttibuteDisplayGrid extends React.Component {
    constructor() {
        super();
    }

    render() {
        const { classes } = this.props;
        const { name, value } = this.props;
        console.log(name, value);
        return (
            <Card>
                <CardContent>
                    <Typography variant='headline'>
                        {name.toUpperCase()}
                    </Typography>
                    <br />

                    <Grid container spacing={24}>
                        {value.map((v, idx) => {
                            return (
                                <Grid item xs key={idx} >
                                    <AttibuteDisplayCard content={v} />
                                </Grid>
                            )
                        })}
                    </Grid>
                </CardContent>
            </Card>
        );
    }
}

AttibuteDisplayGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AttibuteDisplayGrid);