# Server API
---------

## Set Up

### Generate an Admin Secret 
**(In order to create Admin and Player-Admin accounts)**

In the current directory:

```
$ node
$ > const utils = require('./utils');
$ > utils.generateAdminSecret(<Your Admin Secret>);
$ > utils.generateAdminSecret(<Your Level Secret>);
```

Copy the generated hash of the Admin Secret & Level Secret.

```
$ export ADMIN_SECRET='<Admin_Secret_Hash>'
$ export LEVEL_SECRET='<Level_Secret_Hash>'
$ export <OTHER REQUIRED EXPORTS>
```
**Note**: Take care of exporting the `<Admin_Secret_Hash>` and `<Level_Secret_Hash>` within `''`,
for example if the hash generated is `$I.am.theHash`, then do:
```
$ export ADMIN_SECRET='$I.am.theHash'
```

### Export other variables
1. Decide on a decent difficult to guess jwtSecret. The default is `**YouWillNeverGuess**`.
`export JWTSECRET='<Your jwtSecret>'`
2. Find out your `IP` using `ifconfig`.
`export IP=<Your IP>` (only needed in case of hosting on a server)
3. Decide on a port number. Let it be default (`5380`) only if it does not conflict with any other application.
`export PORT=<Your Port>`
4. Decide on a ML_secret.
`export ML='<Your ML secret>'`
5. Finally decide a database name. Default is `gameDB`.
`export DBNAME='<Your database name>'`


## Running 

```
$ npm install
$ npm start
```

### Usage
1. Create Admin account from `/registerAdmin`, using the Admin-Secret passed when starting the app.
2. Create User accounts from `/signup`.
3. Login from `/login`. 
4. Add new levels and modify existing levels after logging in as an Admin user.

Enjoy!

### Other Documents
1. **Portal Setup**: https://github.com/arpanmangal/Serious-Games-Database/blob/master/README.md 
2. **Game Setup**: https://github.com/arpanmangal/Serious-Games-Database/blob/master/api/docs/README.md
