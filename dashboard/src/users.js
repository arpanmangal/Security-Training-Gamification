import React from 'react';
import { List, Datagrid, TextField, EmailField, NumberField } from 'react-admin';
import { Show, SimpleShowLayout } from 'react-admin';
import { Edit, SimpleForm, TextInput, DisabledInput } from 'react-admin';
import { ShowButton, EditButton, DeleteButton } from 'react-admin';
export const UserList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" label="username" />
            <TextField source="name"/>
            <EmailField source="email" />
            <TextField source="university" />
            <TextField source="total_coins" label="Total Coins"/>
            <TextField source="cyber_IQ" label="Cyber IQ"/>
            <ShowButton />
            <DeleteButton />
            {/* <EditButton /> */}
        </Datagrid>
    </List>
);

export const UserShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" label="username" />
            <TextField source="name" />
            <TextField source="email" />
        </SimpleShowLayout>
    </Show>
);

export const UserEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <TextInput source="name" />
            <TextInput source="email" />
        </SimpleForm>
    </Edit>
);