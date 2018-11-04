import React from 'react';
import { List, Datagrid, TextField, UrlField, NumberField } from 'react-admin'
import { Edit, EditButton } from 'react-admin';
import { Create, SimpleForm, TextInput, LongTextInput, UrlInput, NumberInput, DisabledInput } from 'react-admin';
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

export const LevelEdit = props => (
    <Edit  {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <TextInput source="name" />
            <TextInput source="subheading" />
            <TextInput source="category" />
            <TextInput source="difficulty" />
            <TextInput source="type" />
            <LongTextInput source="description" />
            <TextInput source="image_url" />
            <NumberInput source="qualification_iq" />
        </SimpleForm>
    </Edit>
);

export const LevelCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="subheading" />
            <TextInput source="category" />
            <TextInput source="difficulty" />
            <TextInput source="type" />
            <LongTextInput source="description" />
            <TextInput source="image_url" />
            <NumberInput source="qualification_iq" />
        </SimpleForm>
    </Create>
);
