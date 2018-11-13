import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

export default ({ permissions }) => (
    <Card>
        <CardHeader title='Welcome Serious Games Admin!' />
        <CardContent>Lorem ipsum sic dolor amit...</CardContent>
        {permissions === 'admin'
            ? <CardContent>Sensitive data</CardContent>
            : null
        }
    </Card>
);