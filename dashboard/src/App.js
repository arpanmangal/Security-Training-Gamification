import React from 'react';
import { Admin, Resource, ListGuesser, fetchUtils } from 'react-admin';
import { LevelList, LevelEdit, LevelCreate } from './levels';
import UserIcon from '@material-ui/icons/Group';
import LevelIcon from '@material-ui/icons/ViewList';
import Dashboard from './Dashboard';
import authProvider from './authProvider';
import dataProviderr from './dataProvider';

const httpClient = (url, options = {}) => {
  let token = localStorage.getItem('accessToken');
  if (!token) token = '';
  console.log(token);

  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }

  options.headers.set('x-auth-token', token);
  console.log(options);
  
  return fetchUtils.fetchJson(url, options);
}
const dataProvider = dataProviderr('http://localhost:5380/api', httpClient);
const App = () => (
  <Admin dashboard={Dashboard} authProvider={authProvider} dataProvider={dataProvider}>
        <Resource name="level" list={LevelList} icon={LevelIcon} edit={LevelEdit} create={LevelCreate} />
  </Admin>
);
export default App;