import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red, pink, purple, blue, cyan, teal, lime, yellow, amber, brown } from '@material-ui/core/colors/';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PlayIcon from '@material-ui/icons/PlayArrow';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import $ from 'jquery'
import { Types, Categories, Difficulties } from '../Utils/config';

const styles = theme => ({
    card: {
        minWidth: 400,
        maxWidth: 600,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: 'primary',
    },
});

class GameCard extends React.Component {
    state = {
        expanded: false,
        favorite: false,
        colors: [red[500], pink[500], purple[500], blue[500], cyan[500], teal[500], lime[500], yellow[500], amber[500], brown[500]]
    };

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    play = (gameUrl) => {
        let token = localStorage.getItem('accessToken');

        // jquery extend function
        $.extend(
            {
                redirectPost: function (location, args) {
                    var form = '';
                    $.each(args, function (key, value) {
                        value = value.split('"').join('\"')
                        form += '<input type="hidden" name="' + key + '" value="' + value + '">';
                    });
                    $('<form action="' + location + '" method="POST" target="_blank">' + form + '</form>').appendTo($(document.body)).submit();
                }
            });
        $.redirectPost(gameUrl, { token: token });
    }

    toggleFavourite = () => {
        this.setState({
            favorite: !this.state.favorite
        });
    }

    getAvatarStyle = () => {
        const idx = Math.min(parseInt(Math.random() * 10), 9);
        return {
            backgroundColor: this.state.colors[idx]
        }
    }

    render() {
        const { classes, level } = this.props;

        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label={level.name} className={classes.avatar} style={this.getAvatarStyle()}>
                            {level.name[0].toUpperCase()}
                        </Avatar>
                    }
                    action={
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={level.name}
                    subheader={level.subheading}
                />
                <CardMedia
                    className={classes.media}
                    image={level.image_url}
                    title="Paella dish"
                />
                <CardContent>
                    <Typography component="p" paragraph>
                        {level.description}
                    </Typography>
                    <Typography >
                        <b>Category:</b> <em>{Categories[level.category] || ''}</em>
                    </Typography>
                    <Typography >
                        <b>Difficulty:</b> <em>{Difficulties[level.difficulty] || ''}</em>
                    </Typography>
                    <Typography >
                        <b>Type:</b> <em>{Types[level.type] || ''}</em>
                    </Typography>
                    <Typography >
                        <b>Qualification IQ:</b> <em>{level.qualification_iq}</em>
                    </Typography>
                </CardContent>
                <CardActions className={classes.actions} disableActionSpacing>
                    <IconButton
                        aria-label="Add to favorites"
                        onClick={() => { this.toggleFavourite() }}
                        style={this.state.favorite ? {color: red[500]} : {}}
                    >
                        <FavoriteIcon />
                    </IconButton>
                    {/* <IconButton aria-label="Share">
                        <ShareIcon />
                    </IconButton> */}
                    <IconButton 
                        aria-label="Play" 
                        onClick={() => { this.play(level.game_url) }}
                        className={classnames(classes.play)}
                    >
                        <PlayIcon />
                    </IconButton>
                    <IconButton
                        className={classnames(classes.expand, {
                            [classes.expandOpen]: this.state.expanded,
                        })}
                        onClick={this.handleExpandClick}
                        aria-expanded={this.state.expanded}
                        aria-label="Show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography variant='headline'>Rules:</Typography>
                        <br />
                        {level.rules.map((l, idx) => {
                            return (
                                <Typography paragraph key={idx}>
                                    <b>{idx + 1}.</b> {l.rule}
                                </Typography>
                            );
                        })}
                    </CardContent>
                </Collapse>
            </Card>
        );
    }
}

GameCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GameCard);
