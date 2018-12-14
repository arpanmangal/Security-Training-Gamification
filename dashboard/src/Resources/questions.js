import React from 'react';
import { List, Datagrid, TextField, Show, SimpleShowLayout, Create, SimpleForm, TextInput } from 'react-admin'


export const QuestionList = props => (
    <List {...props}>
        <Datagrid rowClick="show">
            <TextField source="SNo" label="S. No."/>
            <TextField source="id" />
            <TextField source="content" label="Question"/>
        </Datagrid>
    </List>
);

export const QuestionShow = props => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="content"/>
        </SimpleShowLayout>
    </Show>
);

export const QuestionCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="question" label="Question Content" />
        </SimpleForm>
    </Create>
);