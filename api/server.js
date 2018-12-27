const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { readdirSync, statSync } = require('fs')
const path = require('path');

const config = require('./config/config');
const utils = require('./utils');
const models = require('./models/models');


/* Creating the App */
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
})); // support encoded bodies
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token, Content-Range");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.use(express.static('build/client'));
const dirs = p => readdirSync(p).filter(f => statSync(path.join(p, f)).isDirectory())
dirs('build/games').forEach(dir => {
    app.use('/game', express.static('build/games/' + dir));
});

/***************** Controllers ******************/
const userController = require('./controllers/userController');
const securityQuestionController = require('./controllers/securityQuestionController');
const levelController = require('./controllers/levelController');
const logController = require('./controllers/logController');

/***************** MongoDB Setup ****************/
// Called at the end of the file
function setUpMongoDB() {
    mongoose.connect('mongodb://' + config.IP + '/' + config.dbName, { useNewUrlParser: true });
    mongoose.set('useCreateIndex', true);

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Failed to connect to DB: '));
    db.once('open', function () {
        // we're connected!
        console.log('Database Connected');
        startApp();
        setUpAPIs();
        setUpViews();
    })
}
/***************** End MongoDB Setup ************/


function startApp() {
    /* Start the app */
    app.listen(config.port, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log('App running successfully on port ' + config.port);
        }
    });
}

function setUpViews() {
    /*************** Client View  ********************/
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'build/client/index.html'));
    });
    /*************** End Client View  ****************/
}

function setUpAPIs() {
    /***************** User API *******************/
    app.get('/api/users', utils.validateToken, utils.checkAdmin, userController.listUsers);
    app.get('/api/users/:id/', utils.validateToken, utils.checkAdmin, userController.viewUser);
    app.delete('/api/users/:id/', utils.validateToken, utils.checkAdmin, userController.deleteUser);

    app.post('/api/user/forgot', userController.forgotPassword);
    app.get('/api/user/scoreList', utils.validateToken, userController.listUsersScore);

    app.post('/api/user/create', userController.createUser);
    app.post('/api/user/createAdmin', userController.createAdmin);
    app.post('/api/user/login', userController.login);
    app.get('/api/user/view', utils.validateToken, userController.viewSelf);
    app.post('/api/user/update', utils.validateToken, userController.updateSelf);
    app.post('/api/user/delete', utils.validateToken, userController.deleteSelf);
    app.post('/api/user/resetPassword', utils.validateToken, userController.resetPassword);
    
    app.post('/api/user/updateCoins', utils.validateToken, userController.updateCoins);
    app.post('/api/user/updateIQ', utils.validateToken, userController.updateIQ);
    /***************** End User API *****************/

    /***************** Security Question API ********/
    app.post('/api/questions', utils.validateToken, utils.checkAdmin, securityQuestionController.addQuestion);
    app.get('/api/questions', securityQuestionController.view);
    app.get('/api/questions/:id', securityQuestionController.viewQuestion);
    /***************** End Security Question API ****/

    /***************** Level API *******************/
    app.get('/api/level/', utils.validateToken, levelController.listLevels);
    app.get('/api/level/:name/', utils.validateToken, levelController.viewLevel);
    app.post('/api/level/', utils.validateToken, utils.checkAdmin, levelController.createLevel);
    app.put('/api/level/:name', utils.validateToken, utils.checkLevelAdmin, levelController.modifyLevel);
    app.delete('/api/level/:name', utils.validateToken, utils.checkAdmin, levelController.deleteLevel);

    app.post('/api/level/modify_secret', utils.validateToken, utils.checkAdmin, levelController.modify_secret);
    app.post('/api/leaderboard', utils.validateToken, levelController.getLeaderboard);

    app.post('/api/level/getattributes', utils.validateToken, levelController.getAttributes);
    app.post('/api/level/playerUpdate', utils.validateToken, levelController.playerUpdate);

    // app.post('/api/level/upadteLeaderboard', utils.validateToken, levelController.getLeaderboard);
    /***************** End Level API *****************/

    /***************** Leaderboard API  *************/
    app.get('/api/leaderboard', function (req, res) {
        let rankings = [
            {
                'name': 'Arpan Mangal',
                'rank': 1,
                'coins': 945,
                'cyber_IQ': 38,
                'levels_played': 79,
                'id': 'arpan'
            }
        ];
        res.set({
            'Access-Control-Expose-Headers': 'Content-Range',
            'Content-Range': 'rankings 0-0/1'
        })
        return utils.res(res, 200, 'Fetched Leaderboard', rankings);
    })
    /***************** End Leaderboard API  *************/

    /***************** Logs API **********************/
    // app.post('/api/logs/create', utils.validateToken, logController.createLog);
    app.post('/api/logs/create_level', utils.validateToken, logController.create_level_info);
    app.post('/api/logs/view', utils.validateToken, logController.view);
    app.post('/api/logs/modify', utils.validateToken, logController.modifyLog);
    app.post('/api/logs/modify_basic', utils.validateToken, logController.modify_attempts);
    app.post('/api/logs/delete', utils.validateToken, utils.checkAdmin, logController.delete_level_info);
    app.post('/api/logs/delete_all', utils.validateToken, utils.checkAdmin, logController.delete_user_info);
    /****************End Logs API **********************/

    /**************** Game API  *******************/
    app.post('/game/:name', utils.validateToken, userController.updateLevels, function (req, res) {
        if (req.params == null || req.params.name == null) {
            res.send('<h1>Bad Request</h1>');
        }
        let gameName = req.params.name;
        fileName = path.join(__dirname, 'build', 'games', gameName, 'index.html');
        res.sendFile(fileName, function (err) {
            if (err) {
                res.send('<h1>404 Not Available</h1>')
            }
        });
    });
    /**************** End Game API  *******************/

}

// Start the DB and the app
setUpMongoDB();