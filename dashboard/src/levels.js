import React, { Fragment } from 'react';
import { List, Datagrid, TextField, UrlField, SelectField, NumberField } from 'react-admin'
import { Edit, EditButton, DeleteButton, ShowButton, SimpleFormIterator } from 'react-admin';
import { Create, SimpleForm, TextInput, LongTextInput, NumberInput, DisabledInput, ArrayInput, SelectInput } from 'react-admin';
import { BulkDeleteButton, CardActions } from 'react-admin';
import { Show, SimpleShowLayout, ArrayField, SingleFieldList } from 'react-admin';
import PlayButton from '@material-ui/icons/PlayCircleFilled';
import Button from '@material-ui/core/Button';
import $ from 'jquery'


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

const NoneActions = props => (
    <CardActions />
);

const PostBulkActionButtons = props => (
    <Fragment>
        <BulkDeleteButton {...props} />
    </Fragment>
);

const PlayField = ({ record, field }) => {
    let handleClick = () => {
        console.log('hello, handle clik');

        let redirect = record[field];
        let token = localStorage.getItem('accessToken');

        // jquery extend function
        $.extend(
            {
                redirectPost: function (location, args) {
                    var form = '';
                    $.each(args, function (key, value) {
                        value = value.split('"').join('\"')
                        form += '<input type="hidden" name="' + key + '" value="' + value + '">';
                    });
                    $('<form action="' + location + '" method="POST" target="_blank">' + form + '</form>').appendTo($(document.body)).submit();
                }
            });
        $.redirectPost(redirect, { token: token });
    }
    return (
        <Button variant="contained" aria-label="Play" onClick={() => { handleClick() }} color="primary">
            <PlayButton />&nbsp;Play
        </Button>
    )
}

// LevelList
export const LevelList = ({ permissions, ...props }) => {
    const { classes } = props;
    return (
        <List {...props} bulkActionButtons={permissions === 'admin' ? <PostBulkActionButtons /> : <NoneActions />}>
            <Datagrid>
                <TextField source="name" />
                <TextField source="subheading" />
                <SelectField source="category" choices={categories} optionText="name" optionValue="id" />
                <SelectField source="difficulty" choices={difficulties} optionText="name" optionValue="id" />
                <SelectField source="type" choices={types} optionText="name" optionValue="id" />
                <UrlField source="image_url" />
                {permissions !== 'admin' &&
                    <PlayField
                        field="game_url"
                    />}
                <ShowButton />
                {permissions === 'admin' &&
                    <DeleteButton
                    />}
            </Datagrid>
        </List>
    );
}


export const LevelEdit = props => {
    return (
        <Edit title={<LevelTitle />} {...props}>
            <SimpleForm>
                <TextInput source="name" />
                <TextInput source="subheading" />
                <SelectInput source="category" choices={categories} />
                <SelectInput source="difficulty" choices={difficulties} />
                <SelectInput source="type" choices={types} />
                <LongTextInput source="description" />
                <TextInput source="image_url" />
                <TextInput source="game_url" />
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
}

export const LevelCreate = props => {
    console.log(props);
    return (
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
}
const ListField = ({ record, source, name }) => {
    // console.log(record, source, record[source])
    if (!record[source]) record[source] = [];
    return (
        <ul>
            {record[source].map(item => (
                <li key={item[name]}>{item[name]}</li>
            ))}
        </ul>
    )
}
ListField.defaultProps = { addLabel: true };

export const LevelShow = props => {
    console.log(props);
    return (
        <Show title={<LevelTitle />} {...props}>
            <SimpleShowLayout>
                <TextField source="name" />
                <TextField source="subheading" />
                <SelectField source="category" choices={categories} optionText="name" optionValue="id" />
                <SelectField source="difficulty" choices={difficulties} optionText="name" optionValue="id" />
                <SelectField source="type" choices={types} optionText="name" optionValue="id" />
                <UrlField source="image_url" />
                <UrlField source="game_url" />
                <TextField source="description" />
                <NumberField source="qualification_iq" />

                <ListField source="rules" name="rule" />
                <ListField source="hints" name="hint" />
            </SimpleShowLayout>
        </Show>
    );
}