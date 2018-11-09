import React from 'react';
import { List, Datagrid, TextField, EmailField, NumberField } from 'react-admin';
import { Show, SimpleShowLayout } from 'react-admin';
import { Edit, SimpleForm, TextInput, DisabledInput } from 'react-admin';
import { ShowButton, EditButton, DeleteButton } from 'react-admin';

const UserTitle = ({ record }) => {
    return <span>Player {record ? `"${record.id}"` : ''}</span>
}

export const UserList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" label="username" />
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="university" />
            <TextField source="total_coins" label="Total Coins" />
            <TextField source="cyber_IQ" label="Cyber IQ" />
            <ShowButton />
            <DeleteButton />
            {/* <EditButton /> */}
        </Datagrid>
    </List>
);

export const UserShow = (props) => (
    <Show title={<UserTitle />} {...props}>
        <SimpleShowLayout>
            <TextField source="id" label="username" />
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="university" />
            <NumberField source="cyber_IQ" />
            <NumberField source="total_coins" />
        </SimpleShowLayout>
    </Show>
);