import React from 'react';
import { List, Datagrid, TextField, EmailField, NumberField } from 'react-admin';
import { Show, SimpleShowLayout } from 'react-admin';
import { ShowButton, DeleteButton } from 'react-admin';
import { Filter, CardActions, ReferenceInput, SelectInput, TextInput } from 'react-admin';

const UserTitle = ({ record }) => {
    return <span>Player {record ? `"${record.id}"` : ''}</span>
}

const AdminField = ({ record, source }) => {
    return (
        <span>
            {record['role'] === 'player' ? record[source] : '-'}
        </span>
    )
}
AdminField.defaultProps = { addLabel: true };

const UserFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Username" source="user_id" alwaysOn />
    </Filter>
);

const NoneActions = props => (
    <CardActions />
);

export const UserList = props => (
    <List {...props} filters={<UserFilter />}>
        <Datagrid>
            <TextField source="id" label="username" />
            <TextField source="name" />
            <TextField source="role" />
            <TextField source="age" />
            <EmailField source="email" />
            <AdminField source="university" />
            <AdminField source="total_coins" label="Total Coins" />
            <AdminField source="cyber_IQ" label="Cyber IQ" />
            <ShowButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const RankingsList = props => (
    <List {...props} actions={<NoneActions />} bulkActionButtons={<NoneActions />}>
        <Datagrid>
            <TextField source="rank" />
            <TextField source="id" label="username" />
            <TextField source="name" />
            <TextField source="total_coins" label="Total Coins"/>
            <TextField source="cyber_IQ" label="Cyber IQ"/>
            <TextField source="levels" label="Levels Played" />
        </Datagrid>
    </List>
);

export const UserShow = (props) => (
    <Show title={<UserTitle />} {...props}>
        <SimpleShowLayout>
            <TextField source="id" label="username" />
            <TextField source="name" />
            <TextField source="role" />
            <EmailField source="email" />
            <AdminField source="university" />
            <AdminField source="cyber_IQ" label="Cyber IQ" />
            <AdminField source="total_coins" />
        </SimpleShowLayout>
    </Show>
);