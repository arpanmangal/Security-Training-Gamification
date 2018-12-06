const config = require('../config/config');
const utils = require('../utils');
const jwt = require('jsonwebtoken');

const models = require('../models/models');

function createLog(user_id, cb){
    let db_log = {
        "user_id": user_id,
        "logs": {}
    };

    let newLog = new models.Logs(db_log);
    newLog.save()
	    .then(function () {
            // Log successfully Instantiated
            return cb(200);
	    })
	    .catch(function (err) {
	        if (err.code == 11000) {
                return cb(400);
	        } else {
                return cb(500);
	        }
	    });
}

/** Admin Deleting the entire log */
function delete_user_info(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid User id');
    }

    // Delete the user
    models.Logs.findOneAndDelete({
        'user_id': req.user_id
    }, function (err, deletedLog) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (deletedLog == null) {
            return utils.res(res, 401, 'Such log does not exist');
        }

        // Successfull Deletion
        return utils.res(res, 200, 'Log deleted successfully');
    });
}


/** Admin Deleting the entire log */
function delete_level_info(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid User id');
    }

    if (req.body.id == null) {
        return utils.res(res, 400, 'Please provide level_id of level log to delete');
    }

    models.Logs.findOne({
        'user_id': req.user_id
    }, function (err, mylogs) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (mylogs == null) {
            return utils.res(res, 401, 'Invalid token provided/ No such log doesn\'t exist');
        }

        delete mylogs.logs[req.body.id];
        const ll = {
            'user_id': req.user_id,
            'logs': mylogs.logs,
        }
        
        models.Logs.findOneAndUpdate({'user_id': req.user_id}, ll, {new: true}, function (err, mylog) {
            if (err) {
                return utils.res(res, 500, 'Internal Server Error');
            }

            if (mylog == null) {
                return utils.res(res, 401, 'Invalid token provided');
            }

            const new_lev = {
                'user_id': mylog.user_id,
                'logs': mylog.logs,
            }
            return utils.res(res, 200, 'Retrieval Successful', new_lev);
        });
    });
}

function create_level_info(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid User id');
    }

    if (req.body.id == null) {
        return utils.res(res, 400, 'Please provide level_id of level log to delete');
    }

    models.Logs.findOne({
        'user_id': req.user_id
    }, function (err, mylogs) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (mylogs == null) {
            return utils.res(res, 401, 'Invalid token provided');
        }

        const level = {
            "number_of_attempts": 1,
            "number_of_successes": 0,
            "max_coins_earned": 0,    
            "info": []   
        }
        // const kk = (req.body.id).toString();
        // console.log(mylogs);        
        if(mylogs.logs == null){
            const new_log = {};
            new_log[req.body.id.toString()] = level;
            mylogs.logs = new_log;
        }else{
            if(mylogs.logs[req.body.id.toString()] == null){
                mylogs.logs[req.body.id.toString()] = level;                
            }
        }

        const ll = {
            'user_id': req.user_id,
            'logs': mylogs.logs,
        }
        
        models.Logs.findOneAndUpdate({'user_id': req.user_id}, ll, {new: true}, function (err, mylog) {
            if (err) {
                return utils.res(res, 500, 'Internal Server Error');
            }

            if (mylog == null) {
                return utils.res(res, 401, 'Invalid token provided');
            }

            const new_lev = {
                'user_id': mylog.user_id,
                'logs': mylog.logs,
            }
            return utils.res(res, 200, 'Retrieval Successful', new_lev);
        });
    });
}


/** Viewing the basic logs */
function view(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if(!req.body.secret == config.ML_secret){
        return utils.res(res, 401, 'Invalid secret');
    }
    // Fetch the user info
    models.Logs.findOne({
        'user_id': req.user_id
    },
    function (err, mylog) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (mylog == null) {
            return utils.res(res, 401, 'Invalid Token');
        }

        const ll = {
            'user_id': mylog.user_id,
            'logs': mylog.logs
        }

        return utils.res(res, 200, 'Retrieval Successful', ll);
    });
}

function modifyLog(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.body.id == null) {
        return utils.res(res, 401, 'level_id undefined');
    }
    
    if (req.body.log_object == null) {
        return utils.res(res, 401, 'log_object undefined');
    }
    models.Logs.findOne({
        'user_id': req.user_id
    }, function (err, mylogs) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (mylogs == null) {
            return utils.res(res, 401, 'Invalid token provided');
        }

        (mylogs.logs[req.body.id]).info.push(req.body.log_object);
        const ll = {
            'user_id': req.user_id,
            'logs': mylogs.logs,
        }
        
        models.Logs.findOneAndUpdate({'user_id': req.user_id}, ll, {new: true}, function (err, mylog) {
            if (err) {
                return utils.res(res, 500, 'Internal Server Error');
            }

            if (mylog == null) {
                return utils.res(res, 401, 'Invalid token provided');
            }

            return utils.res(res, 200, 'Successful');
        });
    });
}

function modify_attempts(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.body.id == null) {
        return utils.res(res, 401, 'level_id undefined');
    }

    if (req.body.success == null) {
        return utils.res(res, 401, 'success undefined');
    }

    if (req.body.coins == null) {
        return utils.res(res, 401, 'coins undefined');
    }

    models.Logs.findOne({
        'user_id': req.user_id
    }, function (err, mylogs) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (mylogs == null) {
            return utils.res(res, 401, 'Invalid token provided');
        }
        console.log(mylogs.logs[req.body.id].number_of_attempts);
        // delete mylogs.logs[req.params.id];
        if(mylogs.logs[req.body.id].number_of_attempts != NaN){
            (mylogs.logs[req.body.id]).number_of_attempts = mylogs.logs[req.body.id].number_of_attempts + 1;
        }else{
            (mylogs.logs[req.body.id]).number_of_attempts = 1;
        }
        if(mylogs.logs[req.body.id].number_of_successes != NaN){
            (mylogs.logs[req.body.id]).number_of_successes = Number(req.body.success) + mylogs.logs[req.body.id].number_of_successes;
        }else{
            (mylogs.logs[req.body.id]).number_of_successes = Number(req.body.success);
        }
        if(mylogs.logs[req.body.id].max_coins_earned != NaN){
            (mylogs.logs[req.body.id]).max_coins_earned = Math.max(Number(req.body.coins),(mylogs.logs[req.body.id]).max_coins_earned);
        }else{
            (mylogs.logs[req.body.id]).max_coins_earned = Number(req.body.coins);
        }
        const ll = {
            'user_id': req.user_id,
            'logs': mylogs.logs,
        }
        
        models.Logs.findOneAndUpdate({'user_id': req.user_id}, ll, {new: true}, function (err, mylog) {
            if (err) {
                return utils.res(res, 500, 'Internal Server Error');
            }

            if (mylog == null) {
                return utils.res(res, 401, 'Invalid token provided');
            }

            return utils.res(res, 200, 'Successful');
        });
    });
}


module.exports = {
    'createLog': createLog,
    'create_level_info': create_level_info,
    'delete_level_info': delete_level_info,
    'delete_user_info': delete_user_info,
    'view': view,
    'modifyLog': modifyLog,
    'modify_attempts': modify_attempts
}
