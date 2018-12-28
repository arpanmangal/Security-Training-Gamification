import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';
import { CardContent, Typography } from '@material-ui/core';
import { Title } from 'react-admin';
import { fetchUtils } from 'react-admin';
import { ApiUrl } from '../../Utils/config';

import { Datagrid, TextField, ReferenceField } from 'react-admin';

const styles = theme => ({
    card: {
        maxWidth: 1500,
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

class Leaderboard extends React.Component {
    constructor() {
        super();
        this.state = {
            ids: [],
            data: {},
        }
    }

    componentDidMount = () => {
        this.loadLevelInfo();
    }

    loadLevelInfo = () => {
        let url = ApiUrl + '/api/leaderboard';
        let body = { 'name': this.props.levelName };

        let options = {}
        let token = localStorage.getItem('accessToken') || '';
        options.headers = new Headers({ Accept: 'application/json' });
        options.headers.set('x-auth-token', token);
        options.method = 'POST'
        options.body = JSON.stringify(body);
        fetchUtils.fetchJson(url, options)
            .then(data => {
                let ids = [];
                let record = {};
                data.json.data.forEach(user => {
                    ids.push(user.rank);
                    record[user.rank] = user;
                });

                this.setState({
                    ids: ids,
                    data: record,
                });
            })
            .catch((err, ...rest) => {
                console.log(err.status, err.message);
                alert(err.message);
            });
    }

    render() {
        const { classes } = this.props;
        const currentSort = { field: "rank", order: "ASC" }
        const setSort = (sort) => { };
        
        return (
            <Card className={classes.card}>
                <Title title={this.props.levelName + ' leaderboard'}></Title>
                <CardContent>
                    {this.state.ids.length === 0
                        ? <Typography variant='display1'>
                            No Records Available
                          </Typography>
                        : <Typography component='span'>
                            <Datagrid basePath="leaderboard" data={this.state.data} ids={this.state.ids} currentSort={currentSort} setSort={setSort}>
                                <TextField source="rank" />
                                <TextField source="username" />
                                <ReferenceField label="Name" source="username" reference="rankings" linkType={false}>
                                    <TextField source="name" />
                                </ReferenceField>
                                <TextField source="coins" label="Level Coins" />
                                <ReferenceField label="Total Coins" source="username" reference="rankings" linkType={false}>
                                    <TextField source="total_coins" />
                                </ReferenceField>
                                <ReferenceField label="Cyber IQ" source="username" reference="rankings" linkType={false}>
                                    <TextField source="cyber_IQ" />
                                </ReferenceField>
                                <ReferenceField label="Levels Played" source="username" reference="rankings" linkType={false}>
                                    <TextField source="levels" />
                                </ReferenceField>
                            </Datagrid>
                        </Typography>
                    }
                </CardContent>
            </Card>
        );
    }
}

Leaderboard.propTypes = {
    classes: PropTypes.object.isRequired,
    levelName: PropTypes.string.isRequired,
};

export default withStyles(styles)(Leaderboard);