import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AttibuteDisplayCard from './AttDispCard';
import Card from '@material-ui/core/Card';
import { CardContent, Typography } from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import InputCard from './AttriInputCard';

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
            inEdit: false,
        }
    }

    handleEdit = () => {
        this.setState({
            inEdit: true,
        });
    }

    handleSave = (name, elements, isJSON) => {
        // console.log(name, elements, isJSON);
        if(!this.props.onUpdate(name, isJSON, elements)) {
            alert('Duplicate Attribute Name');
        } else {
            this.setState({
                inEdit: false,
            });
        }
    }

    handleDelete = () => {
        this.props.onDelete();
    }

    showView = () => {
        return (
            <CardContent>
                <Typography variant='headline'>
                    {this.props.name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toUpperCase()}

                    {this.props.showOnly
                        ? null
                        : <span>
                            <IconButton
                                aria-label="Delete"
                                onClick={this.handleDelete}
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
                    {this.props.attributes.map((v, idx) => {
                        return (
                            <Grid item xs key={idx} >
                                <AttibuteDisplayCard content={v} isJSON={this.props.isJSON}/>
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
                attributeName={this.props.name}
                attributeArray={this.props.attributes}
                onSave={this.handleSave}
                isJSON={this.props.isJSON}
            />
        )
    }

    render() {
        const { classes } = this.props;
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
    onDelete: PropTypes.func,
    onUpdate: PropTypes.func,
};

export default withStyles(styles)(AttibuteDisplayGrid);