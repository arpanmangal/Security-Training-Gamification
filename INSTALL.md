# Serious Games Database

## Initial Setup / Requirements
Install the following (if not available on the system):
1. [NodeJS](https://nodejs.org/en/download/package-manager/)
2. NPM (sudo apt-get install npm)
3. [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
4. React (npm install -g create-react-app)


## Setup front-end portal
```
$ cd api
$ mkdir build
$ mkdir build/client
$ mkdir build/games
$ cd ..
```
```
$ cd dashboard
$ npm install
$ npm run-script build
$ cp -r build/* ../api/build/client
```

## Setup WebGL Unity Game
**Game Setup**: [`api/docs/README.md`](api/docs/README.md)


## Run backend portal
**Server Setup**: [`api/README.md`](api/README.md)


## Notes

### Level categories
Level categories are stored in `/dashboard/utils/config.js`. You can add new categories there (and restart following above procedure), but do not delete existing ones if the database is already set-up.  
Reference: https://searchsecurity.techtarget.com/resources  


## Trouble-shooting
### Problems with React App
If the app gives npm error, try:  
```
$ rm -rf node_modules && npm cache clean --force && npm install
```

### Problems with NodeJS Server
If the app gives mongoDB network error, try:
```
$ sudo service mongod restart
```
and then try restarting the app until it starts.

### Other Documents
1. **Server Setup**: [`api/README.md`](api/README.md) 
2. **Game Setup**: [`api/docs/README.md`](api/docs/README.md)
