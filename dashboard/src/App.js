import React from 'react';
import { Admin, Resource, fetchUtils, ListGuesser, ShowGuesser, EditGuesser } from 'react-admin';
import { LevelList, LevelEdit, LevelCreate, LevelShow, PlayerLevelList, LevelLeaderboardList } from './Resources/levels';
import { UserList, UserShow, RankingsList } from './Resources/users';
import { QuestionList, QuestionShow, QuestionCreate } from './Resources/questions';
import LevelIcon from '@material-ui/icons/ViewList';
import UserIcon from '@material-ui/icons/Group';
import SecurityIcon from '@material-ui/icons/Https';
import LeaderIcon from '@material-ui/icons/TrendingUp';
import RankingIcon from '@material-ui/icons/Sort';
import Dashboard from './Admin/Dashboard';
import customRoutes from './Admin/customRoutes';
import authProvider from './Admin/authProvider';
import dataProviderr from './Admin/dataProvider';
import LoginPage from './Admin/LoginPage';
import AppLayout from './Admin/AppLayout';
import themeReducer from './Admin/themeReducer';
import { ApiUrl } from './Utils/config';

const httpClient = (url, options = {}) => {
  let token = localStorage.getItem('accessToken');
  if (!token) token = '';

  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  options.headers.set('x-auth-token', token);

  return fetchUtils.fetchJson(url, options);
}
const dataProvider = dataProviderr(ApiUrl + '/api', httpClient);
const App = () => (
  <Admin
    appLayout={AppLayout}
    loginPage={LoginPage}
    dashboard={Dashboard}
    authProvider={authProvider}
    dataProvider={dataProvider}
    customRoutes={customRoutes}
    customReducers={{ theme: themeReducer }}
    locale="en"
  >
    {permissions => [
      permissions !== 'guest'
        ? <Resource
          name="level"
          icon={LevelIcon}
          list={permissions !== 'player' ? LevelList : PlayerLevelList}
          edit={permissions === 'level_admin' ? LevelEdit : null}
          show={permissions !== 'player' ? LevelShow : null}
          create={permissions === 'admin' ? LevelCreate : null}
        />
        : null,

      // Only Admin can see users
      permissions === 'admin'
        ? <Resource name="users" list={UserList} icon={UserIcon} show={UserShow}></Resource>
        : null,

      permissions === 'admin'
        ? <Resource name="questions" list={QuestionList} show={QuestionShow} create={QuestionCreate} icon={SecurityIcon}></Resource>
        : null,

      <Resource
        name="leaderboard"
        list={LevelLeaderboardList}
        icon={LeaderIcon}
      />,

      <Resource
        name="rankings"
        list={RankingsList}
        icon={RankingIcon}
      />,
    ]}
  </Admin>
);
export default App;