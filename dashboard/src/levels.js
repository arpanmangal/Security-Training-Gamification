import React from 'react';
import { List, Datagrid, TextField, UrlField, SelectField, NumberField } from 'react-admin'
import { Edit, EditButton, DeleteButton, ShowButton, SimpleFormIterator } from 'react-admin';
import { Create, SimpleForm, TextInput, LongTextInput, NumberInput, DisabledInput, ArrayInput, SelectInput } from 'react-admin';
import { Show, SimpleShowLayout, ArrayField, SingleFieldList } from 'react-admin';
import PlayButton from '@material-ui/icons/PlayCircleFilled';
import { Link } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { link } from 'fs';
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

// const styles = theme => ({
//     button: {
//         margin: theme.spacing.unit,
//     },
//     input: {
//         display: 'none',
//     },
// });

const PlayField = ({ record, source }) => {
    // <span></span>,
    let handleClick = () => {
        console.log('hello, handle clik');

        let redirect = record[source];
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
        /*<Button variant="contained" aria-label="Play" target="_blank" href={record[source]} color="primary">
            <PlayButton />&nbsp;Play
        </Button>*/
        <Button variant="contained" aria-label="Play" onClick={() => { handleClick() }} color="primary">
            <PlayButton />&nbsp;Play
        </Button>
    )
}
export const LevelList = props => {
    const { classes } = props;
    return (
        <List {...props}>
            <Datagrid>
                <TextField source="name" />
                <TextField source="subheading" />
                <SelectField source="category" choices={categories} optionText="name" optionValue="id" />
                <SelectField source="difficulty" choices={difficulties} optionText="name" optionValue="id" />
                <SelectField source="type" choices={types} optionText="name" optionValue="id" />
                <UrlField source="image_url" />
                <PlayField source="game_url" />
                {/* <NumberField source="qualification_iq" /> */}
                <ShowButton />
                <EditButton />
                <DeleteButton />
                {/* <div>Hi</div> */}
                {/* <PlayButton></PlayButton> */}
                {/* <PlayButton component={Link} to="/open-collective"> */}
                {/* Play */}
                {/* </PlayButton> */}
                {/* <IconButton>
                <PlayButton />Play
            </IconButton> */}

            </Datagrid>
        </List>
    );
}

// LevelList
// export const LevelList = props => (

// );

// LevelList.PropTypes = {
//     classes: PropTypes.object.isRequired,
// };
// export const withStyles(styles)(LevelList);

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
            <UrlField source="game_url" />
            <TextField source="description" />
            <NumberField source="qualification_iq" />

            {/* <ListField source="rules" name="rule"/>
            <ListField source="hints" name="hint"/> */}
        </SimpleShowLayout>
    </Show>
);