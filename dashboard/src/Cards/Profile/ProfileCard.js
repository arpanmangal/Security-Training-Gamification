import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';
import { CardContent, Typography } from '@material-ui/core';
import ProfileForm from '../../Forms/profileForm';
import Divider from '@material-ui/core/Divider';
import CoinIcon from '@material-ui/icons/EuroSymbol';
import LaptopIcon from '@material-ui/icons/LaptopMac';
import { fetchUtils } from 'react-admin';
import { ApiUrl, TextRegex } from '../../Utils/config';

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

class NameCard extends React.Component {
    constructor() {
        super();

        this.state = {
            info: {
                coins: '',
                IQ: ''
            },
        }
    }

    componentDidMount() {
        this.loadUserInfo();
    }

    loadUserInfo = () => {
        let url = ApiUrl + '/api/user/view';
        let options = {}
        let token = localStorage.getItem('accessToken') || '';
        options.headers = new Headers({ Accept: 'application/json' });
        options.headers.set('x-auth-token', token);
        options.method = 'GET'
        fetchUtils.fetchJson(url, options)
            .then(data => {
                const info = data.json.data;
                this.setState({
                    info: {
                        coins: info.total_coins,
                        IQ: info.cyber_IQ,
                    }
                });
            })
            .catch((err, ...rest) => {
                console.log(err.status, err.message);
                alert(err.message);
            });
    }

    render() {
        const { classes } = this.props;

        return (
            <Card className={classes.card}>
                <CardHeader
                    title='Public Profile'
                />
                <Divider />
                <CardContent>
                    <Typography component={'span'}>
                        <ProfileForm info={this.state.info} history={this.props.history} />
                    </Typography>
                    {localStorage.getItem('role') === 'player'
                        ? <span>
                            <Divider />
                            <br />
                            <Typography variant='display1'>
                                <LaptopIcon /> Cyber IQ: {this.state.info.IQ}
                            </Typography>
                            <Typography variant='display1'>
                                <CoinIcon /> Coins: {this.state.info.coins}
                            </Typography>
                        </span>
                        : null}
                </CardContent>
            </Card>
        );
    }
}

NameCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NameCard);