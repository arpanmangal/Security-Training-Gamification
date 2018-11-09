import React from 'react';
import { List, Datagrid, TextField, UrlField, SelectField, NumberField } from 'react-admin'
import { Edit, EditButton, DeleteButton, ShowButton, SimpleFormIterator } from 'react-admin';
import { Create, SimpleForm, TextInput, LongTextInput, NumberInput, DisabledInput, ArrayInput, SelectInput } from 'react-admin';
import { Show, SimpleShowLayout, ArrayField, SingleFieldList } from 'react-admin';

const LevelTitle = ({ record }) => {
    return <span>Level {record ? `"${record.name}"` : ''}</span>
}

const categories = [
    { id: "general", name: "General" },
    { id: "hack", name: "Hacking" },
    { id: "other", name: "Other" }
];

const types = [
    { id: "single", name: "Single Player" },
    { id: "multi", name: "Multi Player" }
];

const difficulties = [
    { id: "easy", name: "Easy" },
    { id: "med", name: "Medium" },
    { id: "hard", name: "Hard" }
]

export const LevelList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="name" />
            <TextField source="subheading" />
            <SelectField source="category" choices={categories} optionText="name" optionValue="id" />
            <SelectField source="difficulty" choices={difficulties} optionText="name" optionValue="id" />
            <SelectField source="type" choices={types} optionText="name" optionValue="id" />
            <UrlField source="image_url" />
            {/* <NumberField source="qualification_iq" /> */}
            <ShowButton />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const LevelEdit = props => (
    <Edit title={<LevelTitle />} {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <TextInput source="name" />
            <TextInput source="subheading" />
            <SelectInput source="category" choices={categories} />
            <SelectInput source="difficulty" choices={difficulties} />
            <SelectInput source="type" choices={types} />
            <LongTextInput source="description" />
            <TextInput source="image_url" />
            <NumberInput source="qualification_iq" />
            <ArrayInput source="rules">
                <SimpleFormIterator>
                    <TextInput source="rule" />
                </SimpleFormIterator>
            </ArrayInput>
            <ArrayInput source="hints">
                <SimpleFormIterator>
                    <TextInput source="hint" />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Edit>
);

export const LevelCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="subheading" />
            <SelectInput source="category" choices={categories} />
            <SelectInput source="difficulty" choices={difficulties} />
            <SelectInput source="type" choices={types} />
            <LongTextInput source="description" />
            <TextInput source="image_url" />
            <NumberInput source="qualification_iq" />
        </SimpleForm>
    </Create>
);

const ListField = ({ record, source, name }) => (
    <ul>
        {record[source].map(item => (
            <li key={item[name]}>{item[name]}</li>
        ))}
    </ul>
)
ListField.defaultProps = { addLabel: true };

export const LevelShow = props => (
    <Show title={<LevelTitle />} {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="subheading" />
            <SelectField source="category" choices={categories} optionText="name" optionValue="id" />
            <SelectField source="difficulty" choices={difficulties} optionText="name" optionValue="id" />
            <SelectField source="type" choices={types} optionText="name" optionValue="id" />
            <UrlField source="image_url" />
            <TextField source="description" />
            <NumberField source="qualification_iq" />

            <ListField source="rules" name="rule"/>
            <ListField source="hints" name="hint"/>
        </SimpleShowLayout>
    </Show>
);