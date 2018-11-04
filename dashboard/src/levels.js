import React from 'react';
import { List, Datagrid, TextField, UrlField } from 'react-admin'
import { EditButton } from 'react-admin';

export const LevelList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <TextField source="subheading" />
            <TextField source="category" />
            <TextField source="difficulty" />
            <TextField source="type" />
            <UrlField source="image_url" />
            {/* <NumberField source="qualification_iq" /> */}
            <EditButton />
        </Datagrid>
    </List>
);