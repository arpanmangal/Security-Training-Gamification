import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { List, Datagrid, TextField, UrlField, SelectField, NumberField, ImageField, BooleanField } from 'react-admin'
import { Edit, EditButton, DeleteButton, ShowButton, SimpleFormIterator } from 'react-admin';
import { Create, SimpleForm, TextInput, LongTextInput, NumberInput, DisabledInput, ArrayInput, SelectInput, BooleanInput } from 'react-admin';
import { BulkDeleteButton, CardActions, RefreshButton, FilterButton } from 'react-admin';
import { Show, SimpleShowLayout, ArrayField, SingleFieldList } from 'react-admin';
import { fetchUtils } from 'react-admin';
import { ApiUrl, Types, Categories, Difficulties } from '../Utils/config';
import GameGrid from '../Cards/GameGrid';
import AttibuteDisplayGrid from '../Cards/Attributes/AttDispGrid';
import { Filter, ReferenceInput } from 'react-admin';
import { Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { Field } from 'redux-form';
import TextFieldMU from '@material-ui/core/TextField';

const LevelTitle = ({ record }) => {
    return <span>Level {record ? `"${record.name}"` : ''}</span>
}

const genList = (dict) => {
    let list = [];
    for (let key in dict) {
        list.push({
            id: key,
            name: dict[key] || "Other",
        });
    }
    return list;
}

const types = genList(Types);
const difficulties = genList(Difficulties);
const categories = genList(Categories);

/****************** Listing Levels **********************/
const NoneActions = props => (
    <CardActions />
);

const PostBulkActionButtons = props => (
    <Fragment>
        <BulkDeleteButton {...props} />
    </Fragment>
);

const LevelFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Level Name" source="name" alwaysOn />
        <SelectInput source="category" label="Category" choices={categories} optionText="name" optionValue="id" alwaysOn />
        <SelectInput source="difficulty" label="Difficulty" choices={difficulties} optionText="name" optionValue="id" alwaysOn={props.on === 'always'} />
        <SelectInput source="type" label="Type" choices={types} optionText="name" optionValue="id" alwaysOn={props.on === 'always'} />
    </Filter>
);
LevelFilter.propTypes = {
    on: PropTypes.string,
};

export const LevelList = ({ permissions, ...props }) => {
    const { classes } = props;
    return (
        <List {...props} filters={<LevelFilter />} bulkActionButtons={permissions === 'admin' ? <PostBulkActionButtons /> : <NoneActions />}>
            <Datagrid>
                <TextField source="name" />
                <TextField source="subheading" />
                <SelectField source="category" choices={categories} optionText="name" optionValue="id" />
                <SelectField source="difficulty" choices={difficulties} optionText="name" optionValue="id" />
                <SelectField source="type" choices={types} optionText="name" optionValue="id" />
                <UrlField source="game_url" />
                <BooleanField source="isAvailable" label="Available" />
                <ShowButton />
                {/* <EditButton /> */}
                {permissions === 'admin' &&
                    <DeleteButton
                    />}
            </Datagrid>
        </List>
    );
}

export const PlayerLevelList = ({ permissions, ...props }) => (
    <List {...props} actions={<NoneActions />} sort={{ field: 'name', order: 'ASC' }} filters={<LevelFilter on={'always'} />} filterDefaultValues={{ is_client: true }}>
        <GameGrid />
    </List>
);


/************** Editing Levels ***************/
const LevelEditActions = ({ basePath, data, resource, history, ...props }) => {
    const levelName = (data && data.id) ? data.id : '';
    return (
        <CardActions>
            <ShowButton basePath={basePath} record={data} />
            <Button color="primary" onClick={() => { history.push('/attributes/' + levelName) }}><EditIcon /> &nbsp; Edit Attributes</Button>
        </CardActions>
    );
}

const required = (message = 'Required') =>
    value => value ? undefined : message;

export const LevelEdit = props => {
    return (
        <Edit title={<LevelTitle />} actions={<LevelEditActions history={props.history} />} {...props}>
            <SimpleForm>
                <DisabledInput source="name" />
                <BooleanInput label="Available" source="isAvailable" />
                <TextInput source="level_secret" label="Level Password" type="password" autoComplete="new-password" validate={[required()]}/>
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

/************** Creating Levels ***************/
export const LevelCreate = props => {
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
                <TextInput source="level_secret" label="Level Password" type="password" autoComplete="new-password" />
            </SimpleForm>
        </Create>
    );
}


/************** Showing Levels ***************/
const ListField = ({ record, source, name }) => {
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

const ImageUrlField = ({ record = {}, source }) => {
    const url = record[source] ? (record[source].substr(0, 20) + '...') : '-';
    return (
        <a href={record[source]}>
            {url}
        </a>
    );
}
ImageUrlField.defaultProps = { addLabel: true };

const AttributeField = ({ source, record = {} }) => {
    let attributes = [];
    for (let key in record[source]) {
        attributes.push({
            name: key,
            isJSON: record[source][key]['isJSON'],
            value: record[source][key]['list'],
        });
    }

    return (
        <span>
            {attributes.map((att, idx) => {
                return (
                    <span key={idx}>
                        <AttibuteDisplayGrid
                            name={att.name}
                            isJSON={att.isJSON}
                            attributes={att.value}
                            showOnly={true}
                        />
                        <br />
                    </span>
                )
            })}
        </span>
    );
}
AttributeField.propTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};
AttributeField.defaultProps = { addLabel: true };

const LevelShowActions = ({ permissions, basePath, data, resource, history, ...props }) => {
    const levelName = (data && data.id) ? data.id : '';
    return (
        <CardActions>
            {permissions === 'level_admin'
                ? <span>
                    <EditButton basePath={basePath} record={data} />
                    <Button color="primary" onClick={() => { history.push('/attributes/' + levelName) }}><EditIcon /> &nbsp; Edit Attributes</Button>
                </span>
                : <Button color="primary" onClick={() => { history.push('/levelSecret/' + levelName) }}><EditIcon /> &nbsp; Edit Level Password</Button>
            }
        </CardActions>
    );
}

export const LevelShow = ({ permissions, ...props }) => {
    return (
        <Show title={<LevelTitle />} actions={(permissions === 'admin' || permissions === 'level_admin') ? <LevelShowActions permissions={permissions} history={props.history} /> : null} {...props}>
            <SimpleShowLayout>
                <TextField source="name" />
                <BooleanField source="isAvailable" label="Available" />
                <TextField source="subheading" />
                <SelectField source="category" choices={categories} optionText="name" optionValue="id" />
                <SelectField source="difficulty" choices={difficulties} optionText="name" optionValue="id" />
                <SelectField source="type" choices={types} optionText="name" optionValue="id" />
                <ImageUrlField source="image_url" label="Level Image" />
                <ImageField source="image_url" title="Level Image" />
                <UrlField source="game_url" />
                <TextField source="description" />
                <NumberField source="qualification_iq" />

                <ListField source="rules" name="rule" />
                <ListField source="hints" name="hint" />
                <AttributeField source="attributes" />
            </SimpleShowLayout>
        </Show>
    );
}