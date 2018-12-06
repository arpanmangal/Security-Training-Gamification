import React from 'react';
import { Admin, Resource, fetchUtils, ListGuesser, ShowGuesser, EditGuesser } from 'react-admin';
import { LevelList, LevelEdit, LevelCreate, LevelShow } from './levels';
import { LeaderboardList } from './LeaderBoard';
import { UserList, UserShow } from './users';
import { QuestionList, QuestionShow, QuestionCreate } from './questions';
import LevelIcon from '@material-ui/icons/ViewList';
import UserIcon from '@material-ui/icons/Group';
import LeaderIcon from '@material-ui/icons/TrendingUp';
import SecurityIcon from '@material-ui/icons/Https';
import Dashboard from './Dashboard';
import customRoutes from './customRoutes';
import authProvider from './authProvider';
import dataProviderr from './dataProvider';
import LoginPage from './LoginPage';

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
    loginPage={LoginPage}
    dashboard={Dashboard}
    authProvider={authProvider}
    dataProvider={dataProvider}
    customRoutes={customRoutes}
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

      permissions === 'admin'
        ? <Resource name="questions" list={QuestionList} show={QuestionShow} create={QuestionCreate} icon={SecurityIcon}></Resource>
        : null,

      <Resource
        name="leaderboard"
        list={LeaderboardList}
        icon={LeaderIcon}
      />
    ]}
  </Admin>
);
export default App;