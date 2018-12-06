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
```

Copy the generated hash of the Admin Secret.

```
$ export ADMIN_SECRET='<Admin_Secret_Hash>'
$ export <OTHER REQUIRED EXPORTS>
```
**Note**: Take care of exporting the `<Admin_Secret_Hash>` within `''`.

### Running 

```
$ npm install
$ npm start
```

### Usage
1. Create Admin account from `/registerAdmin`, using the Admin-Secret passed when starting the app.
2. Create User accounts from `/signup`.
3. Login from `/login`. 