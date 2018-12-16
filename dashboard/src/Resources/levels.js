import React, { Fragment } from 'react';
import { List, Datagrid, TextField, UrlField, SelectField, NumberField } from 'react-admin'
import { Edit, EditButton, DeleteButton, ShowButton, SimpleFormIterator } from 'react-admin';
import { Create, SimpleForm, TextInput, LongTextInput, NumberInput, DisabledInput, ArrayInput, SelectInput } from 'react-admin';
import { BulkDeleteButton, CardActions } from 'react-admin';
import { Show, SimpleShowLayout, ArrayField, SingleFieldList } from 'react-admin';
import GameGrid from '../Cards/GameGrid';
import { fetchUtils } from 'react-admin';
import { ApiUrl, Types, Categories, Difficulties } from '../Utils/config';

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

const NoneActions = props => (
    <CardActions />
);

const PostBulkActionButtons = props => (
    <Fragment>
        <BulkDeleteButton {...props} />
    </Fragment>
);

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

const ImageField = ({ record = {}, source }) => {
    const url = record[source] ? (record[source].substr(0, 20) + '...') : '-';
    return (
        <a href={record[source]}>
            {url}
        </a>
    );
}
ImageField.defaultProps = { addLabel: true };

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
                <ImageField source="image_url" />
                <UrlField source="game_url"/>
                <TextField source="description" />
                <NumberField source="qualification_iq" />

                <ListField source="rules" name="rule" />
                <ListField source="hints" name="hint" />
            </SimpleShowLayout>
        </Show>
    );
}

export class PlayerLevelList extends React.Component {
    constructor() {
        super();

        this.state = {
            levels: []
        }
    }

    componentDidMount() {
        this.loadLevelInfo();
    }

    loadLevelInfo = () => {
        let url = ApiUrl + '/api/level?range=[0,20000]';
        let options = {}
        let token = localStorage.getItem('accessToken') || '';
        options.headers = new Headers({ Accept: 'application/json' });
        options.headers.set('x-auth-token', token);
        options.method = 'GET'
        fetchUtils.fetchJson(url, options)
            .then(data => {
                const info = data.json.data;
                this.setState({
                    levels: info,
                });
            })
            .catch((err, ...rest) => {
                alert(err.message);
                this.props.history.push('/');
            });
    }

    render() {
        return (
            <GameGrid record={this.state.levels} />
        );
    }
}