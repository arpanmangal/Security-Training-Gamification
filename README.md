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
$ cd ..
```
```
$ cd dashboard
$ npm install
$ npm run-script build
$ cp -r build/* ../api/build/client
```

## Setup WebGL Unity Game
@Atishya add here

## Run backend portal
```
$ cd api
```
Follow the instructions in the `README.md` there. 