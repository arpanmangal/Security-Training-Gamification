import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AttibuteDisplayCard from './AttDispCard';
import { Title } from 'react-admin';
import Card from '@material-ui/core/Card';
import { CardContent, Typography } from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import InputCard from './InputCard';

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

        this.state = {
            attributeName: '',
            attributeArray: [],
            showOnly: true,
            inEdit: false,
            isJSON: false,
        }
    }

    componentDidMount = () => {
        console.log(this.props);
        this.setState({
            attributeName: this.props.name,
            attributeArray: this.props.attributes,
            showOnly: this.props.showOnly,
            isJSON: this.props.isJSON,
        });
    }

    handleEdit = () => {
        this.setState({
            inEdit: true,
        });
    }

    handleSave = (name, elements, isJSON) => {
        console.log(name, elements, isJSON);

        this.setState({
            inEdit: false,
        });
    }

    showView = () => {
        return (
            <CardContent>
                <Typography variant='headline'>
                    {this.state.attributeName.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toUpperCase()}

                    {this.state.showOnly
                        ? null
                        : <span>
                            <IconButton
                                aria-label="Delete"
                                style={{ float: 'right' }}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton
                                aria-label="Edit"
                                onClick={this.handleEdit}
                                style={{ float: 'right' }}>
                                <EditIcon />
                            </IconButton>
                        </span>
                    }
                </Typography>
                <br />

                <Grid container spacing={24}>
                    {this.state.attributeArray.map((v, idx) => {
                        return (
                            <Grid item xs key={idx} >
                                <AttibuteDisplayCard content={v} isJSON={this.state.isJSON}/>
                            </Grid>
                        )
                    })}
                </Grid>
            </CardContent>
        );
    }

    editView = () => {
        return (
            <InputCard
                attributeName={this.state.attributeName}
                attributeArray={this.state.attributeArray}
                onSave={this.handleSave}
                isJSON={this.state.isJSON}
            />
        )
    }

    render() {
        const { classes } = this.props;
        console.log(this.state);
        return (
            <Card>
                {this.state.inEdit
                    ? this.editView()
                    : this.showView()
                }
            </Card>
        );
    }
}

AttibuteDisplayGrid.propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    attributes: PropTypes.array.isRequired,
    showOnly: PropTypes.bool.isRequired,
    isJSON: PropTypes.bool.isRequired,
};

export default withStyles(styles)(AttibuteDisplayGrid);