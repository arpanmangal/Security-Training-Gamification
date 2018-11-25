const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
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

app.use(express.static('build/client'))
app.use(express.static('build/game1'))

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
            console.log('App running successfully on ' + config.port);
        }
    });
}

function setUpAPIs() {
    /***************** User API *******************/
    app.get('/api/users', utils.validateToken, utils.checkAdmin, userController.listUsers);
    app.get('/api/users/:id/', utils.validateToken, utils.checkAdmin, userController.viewUser);
    app.delete('/api/users/:id/', utils.validateToken, utils.checkAdmin, userController.deleteUser);

    app.post('/api/user/create', userController.createUser);
    app.post('/api/user/login', userController.login);
    app.get('/api/user/view', utils.validateToken, userController.viewUser);
    // app.get('/api/user/adminViewUser', utils.validateToken, utils.checkAdmin, userController.adminViewUser);
    app.post('/api/user/delete', utils.validateToken, userController.deleteUser);
    // app.post('/api/user/modify', utils.validateToken, userController.modifyUser);
    // app.post('/api/user/updateScore', utils.validateToken, userController.updateScore);
    // app.post('/api/user/updateLevelInfo', utils.validateToken, userController.updateLevelInfo);
    // app.post('/api/user/updateAssessment', utils.validateToken, userController.updateAssessment);
    app.post('/api/user/forgot', userController.forgotPassword);
    app.post('/api/user/resetPassword', utils.validateToken, userController.resetPassword);
    /***************** End User API *****************/

    /***************** Security Question API ********/
    app.post('/api/questions', utils.validateToken, utils.checkAdmin, securityQuestionController.addQuestion);
    app.get('/api/questions', securityQuestionController.view);
    app.get('/api/questions/:id', securityQuestionController.viewQuestion);
    // app.delete('/api/questions/:id', utils.validateToken, utils.checkAdmin, securityQuestionController.viewQuestion);
    /***************** End Security Question API ****/

    /***************** Level API *******************/
    app.get('/api/level/', utils.validateToken, levelController.listLevels);
    app.get('/api/level/:id/', utils.validateToken, levelController.browser_view); 
    app.post('/api/level/', utils.validateToken, utils.checkAdmin, levelController.createLevel);
    app.put('/api/level/:id', utils.validateToken, utils.checkAdmin, levelController.modifyLevel);
    app.delete('/api/level/:id', utils.validateToken, utils.checkAdmin, levelController.deleteLevel);
    app.post('/api/level/getattributes', utils.validateToken, levelController.getAttributes);
    app.post('/api/level/playerUpdate', utils.validateToken, levelController.playerUpdate);
    app.post('/api/level/leaderboard', utils.validateToken, levelController.getLeaderboard);
    app.post('/api/level/getCategories', utils.validateToken, levelController.getCategories);
    app.post('/api/level/getType', utils.validateToken, levelController.getType);
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
    app.post('/api/logs/create', utils.validateToken, logController.createLog);
    app.post('/api/logs/create_level', utils.validateToken, logController.create_level_info);
    app.post('/api/logs/view', utils.validateToken, logController.view);
    app.post('/api/logs/modify', utils.validateToken, logController.modifyLog);
    app.post('/api/logs/modify_basic', utils.validateToken, logController.modify_attempts);
    app.post('/api/logs/delete', utils.validateToken, utils.checkAdmin, logController.delete_level_info);
    app.post('/api/logs/delete_all', utils.validateToken, utils.checkAdmin, logController.delete_user_info);
    /****************End Logs API **********************/

    /**************** Testing  */
    app.post('/testing/', function (req, res) {
        if (req == null || req.body == null || req.body.token == null) {
            res.send('fail');
        } else {
            // res.send('Success!! You sent: ' + req.body.token);
            res.sendFile(path.join(__dirname, 'build/game1/index.html'));
        }
    });  
}

function setUpViews() {
    app.get('/', function(req, res) {
        // res.sendFile(path.join(__dirname, 'views/index.html'));
        res.sendFile(path.join(__dirname, 'build/client/index.html'));
    });
    app.get('/signup', function(req, res) {
        res.sendFile(path.join(__dirname, 'views/user/signup.html'));
    });
    app.get('/reset', function (req, res) {
        res.sendFile(path.join(__dirname, 'views/user/reset.html'));
    });
    app.get('/forgot', function (req, res) {
        res.sendfile(path.join(__dirname, 'views/user/forgot.html'));
    });

    // Old views
    app.get('/login', function(req, res) {
        res.sendFile(path.join(__dirname, 'views/user/login.html'));
    });
    app.get('/logout', function (req, res) {
        res.sendFile(path.join(__dirname, 'views/user/logout.html'));
    });
    app.get('/profile', function(req, res) {
        res.sendFile(path.join(__dirname, 'views/user/view.html'));
    });
    app.get('/resetPassword', function(req, res) {
        res.sendFile(path.join(__dirname, 'views/user/resetPass.html'));
    });
    app.get('/settings', function (req, res) {
        res.sendFile(path.join(__dirname, 'views/user/settings.html'));
    });
}


// Start the DB and the app
setUpMongoDB();