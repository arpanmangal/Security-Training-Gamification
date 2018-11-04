import React from 'react';
import { Admin, Resource, ListGuesser, fetchUtils } from 'react-admin';
// import { UserList } from './users';
// import { PostList, PostEdit, PostCreate } from './posts'
// import jsonServerProvider from 'ra-data-json-server';
// import PostIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';
// import Dashboard from './Dashboard';
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
  
  return fetchUtils.fetchJson(url, options);
}
const dataProvider = dataProviderr('http://localhost:5380/api', httpClient);
const App = () => (
  <Admin authProvider={authProvider} dataProvider={dataProvider}>
        <Resource name="level" list={ListGuesser} icon={UserIcon} />
  </Admin>
);
export default App;