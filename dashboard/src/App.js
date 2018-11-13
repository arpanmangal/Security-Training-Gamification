import React from 'react';
import { Admin, Resource, fetchUtils, ListGuesser, ShowGuesser, EditGuesser } from 'react-admin';
import { LevelList, LevelEdit, LevelCreate, LevelShow } from './levels';
import { UserList, UserShow } from './users';
import LevelIcon from '@material-ui/icons/ViewList';
import UserIcon from '@material-ui/icons/Group';
import Dashboard from './Dashboard';
// import customRoutes from './customRoutes';
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
  <Admin
    dashboard={Dashboard}
    authProvider={authProvider}
    dataProvider={dataProvider}
  >
    {permissions => [
      <Resource
        name="level"
        list={LevelList}
        icon={LevelIcon}
        edit={permissions === 'admin' ? LevelEdit : null}
        show={LevelShow}
        create={permissions === 'admin' ? LevelCreate : null}
      />,

      // Only Admin can see users
      permissions === 'admin'
        ? <Resource name="users" list={UserList} icon={UserIcon} show={UserShow}></Resource>
        : null,
    ]}
  </Admin>
);
export default App;