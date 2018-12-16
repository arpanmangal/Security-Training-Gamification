import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import GameCard from './GameCard';
import { Title } from 'react-admin';

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

class GameGrid extends React.Component {
    constructor() {
        super();
    }

    render() {
        const { classes } = this.props;
        const { record } = this.props;
        console.log(record);
        return (
            <div className={classes.root} >
                <Title title='Levels'></Title>
                <Grid container spacing={24}>
                    {record.map(l => {
                        return (
                            <Grid item xs key={l._id} >
                                <GameCard level={l} />
                            </Grid>
                        )
                    })}
                </Grid>
            </div>
        );
    }
}

GameGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GameGrid);