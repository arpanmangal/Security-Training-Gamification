import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

export default ({ permissions }) => (
    <Card>
        <CardHeader title={'Welcome ' + localStorage.getItem('userName') + ' !!'} />
        {permissions === 'admin'
            ? <CardContent>Enjoy the Editing</CardContent>
            : <CardContent>Enjoy the games</CardContent>
        }
    </Card>
);