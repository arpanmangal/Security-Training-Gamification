import React from 'react';
import { List, Datagrid, TextField } from 'react-admin'

// LevelList
export const LeaderboardList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="rank" />
            <TextField source="name" />
            <TextField source="coins" />
            <TextField source="cyber_IQ" />
            <TextField source="levels_played" />
        </Datagrid>
    </List>
);