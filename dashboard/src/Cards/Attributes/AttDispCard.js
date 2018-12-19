import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { CardContent, Typography } from '@material-ui/core';
import JSONPretty from 'react-json-pretty';

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
});

class AttributeDisplayCard extends React.Component {
    contentStr = (content) => {
        if (typeof (content) === 'string') return content;
        else return JSON.stringify(content);
    }
    render() {
        const { classes } = this.props;
        const { content } = this.props;

        return (
            <Card className={classes.card} >
                <CardContent>
                    <Typography component={'span'}>
                        {this.props.isJSON
                            ? <JSONPretty json={content}></JSONPretty>
                            : <span>{this.contentStr(content)}</span>
                        }
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

AttributeDisplayCard.propTypes = {
    classes: PropTypes.object.isRequired,
    isJSON: PropTypes.bool.isRequired,
};

export default withStyles(styles)(AttributeDisplayCard);