import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK, AUTH_GET_PERMISSIONS } from 'react-admin';
import { ApiUrl } from './config';

const apiUrl = ApiUrl + '/api/user/login';

export default (type, params) => {
    alert('Checking auth: ' + type + '\n');
    alert(params);
    if (type === AUTH_LOGIN) {
        const { username, password } = params;
        const request = new Request(apiUrl, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        console.log(request);
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((res) => {
                console.log(res.data);
                localStorage.setItem('admin', res.data.admin);
                localStorage.setItem('accessToken', res.data.token);
                localStorage.setItem('userName', res.data.user.name);
                console.log(localStorage);
            });
    }
    // called when the user clicks on the logout button
    if (type === AUTH_LOGOUT) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('admin');
        localStorage.removeItem('userName');
        return Promise.resolve();
    }
    // called when the API returns an error
    if (type === AUTH_ERROR) {
        const { status } = params;
        if (status === 401 || status === 403) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('admin');
            localStorage.removeItem('userName');
            return Promise.reject();
        }
        return Promise.resolve();
    }
    // called when the user navigates to a new location
    if (type === AUTH_CHECK) {
        const { resource } = params;
        // alert(resource);
        if (resource === 'signup') return Promise.resolve();

        return localStorage.getItem('accessToken')
            ? Promise.resolve()
            : Promise.reject();
    }
    if (type === AUTH_GET_PERMISSIONS) {
        const { resource } = params;
        alert (resource, JSON.stringify(params));
        const role = localStorage.getItem('admin');
        return role ? Promise.resolve(role) : Promise.reject();
    }
    return Promise.reject('Unknown method');
};