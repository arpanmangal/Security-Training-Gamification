import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import GameCard from './GameCard';

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
    render() {
        const { classes } = this.props;
        const { data, ids } = this.props;
        return (
            <Card>
                <CardContent>
                    <Grid container spacing={24}>
                        {ids.map(id => {
                            return (
                                <Grid item xs key={id} >
                                    <GameCard level={data[id]} />
                                </Grid>
                            )
                        })}
                    </Grid>
                </CardContent>
            </Card>
        );
    }
}

GameGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GameGrid);