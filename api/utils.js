/*
 * @Author: arpan.mangal 
 * @Date: 2018-09-09 00:27:05 
 * @Last Modified by: arpan.mangal
 * @Last Modified time: 2018-09-23 18:13:05
 */

const config = require('./config/config');
const jwt = require('jsonwebtoken');
const models = require('./models/models')

function resp(res, statusCode, msg, data = null) {
    try {
        return res.status(statusCode).json({
            'error': (statusCode === 200) ? false : true,
            'message': msg,
            'data': data
        });
    } catch (err) {
        console.log(err);
    }
}

// The function to validate token takes token from req.headers['x-auth-token']
// Returns the 'email' key for user database in req.usrEmail by calling next()
function validateToken(req, res, next) {

    const token = req.headers['x-auth-token'] || req.body.token || req.query.token;
    const requested_user_id = req.headers['user_id'] || req.body.user_id || req.query.user_id;

    if (!token) {
        return resp(res, 401, 'No token provided.');
    }

    // Verifies secret and checks expiry
    jwt.verify(token, config.jwtSecret, function (err, payload) {
        if (err) {
            console.log(err);
            return resp(res, 401, 'Invalid Token');
        }

        models.User.findOne({
            'user_id': payload.user_id
        }, function (err, loggedUser) {
            if (err) {
                return resp(res, 500, 'Internal Server Error');
            }

            if (loggedUser == null) {
                // No such user exists
                console.log('No such user exists');
                return resp(res, 401, 'Invalid Token');
            }

            // Continue the request
            req.user_id = payload.user_id;
            req.role = loggedUser.role;
            req.requested_user_id = requested_user_id; // For Admin fetching a user
            return next();
        });
    });
}


function checkAdmin(req, res, next) {
    if (req == null || req.role == null || req.role != "admin") {
        return resp(res, 403, "You do not have required permissions");
    }
    else {
        return next();
    }
}


module.exports = {
    'res': resp,
    'validateToken': validateToken,
    'checkAdmin': checkAdmin
}