const config = require('../config/config');
const utils = require('../utils');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const models = require('../models/models');
const logController = require('./logController');

/** Creating the user */
function createUser(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    // Check Request Body
    const user = req.body;
    if (user == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (user.user_id == null || user.name == null || user.email == null || user.password == null ||
        user.security_question_id == null || user.security_answer == null) {
        return utils.res(res, 400, 'Bad Request, Incomplete Information');
    }

    // Validate user input
    if (config.nameRegex.test(user.user_id)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'User ID should contain only alphanumeric and [ _ - ] characters');
    }

    if (!user.email.match(config.emailRegex)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Please enter a valid email address');
    }

    if (!config.passwordRegex.test(user.password)) {
        // Contains dangerous special characters
        let msg = 'Password should be of 8-13 characters, ' +
            'at least one uppercase letter, one lowercase letter, one number and one special character from @$!%*?&';
        return utils.res(res, 400, msg);
    }

    if (config.nameRegex.test(user.security_question_id)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Bad Request');
    }

    if (config.textRegex.test(user.name) || config.alphaNumericRegex.test(user.security_answer)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Please enter alphanumeric characters only');
    }

    if ((!(user.university == null)) && config.textRegex.test(user.university)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'University Name should not contain special characters');
    }


    // Hash the password and then create the user
    bcrypt.hash(user.password, saltRounds, (err, hash) => {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        let db_user = {
            "user_id": user.user_id,
            "password": hash,
            "name": user.name,
            "email": user.email,
            "security_question": {
                "question_id": user.security_question_id,
                "answer": user.security_answer
            },
            "levels": {}, // No level for new user
            "assessments": {} // No assessment for new user
        };

        // Add additional parameters 
        // Leave coins and user_IQ at default values
        if (!(user.university == null)) db_user["university"] = user.university;

        // Insert into DB
        let newUser = new models.User(db_user);
        newUser.save()
            .then(function () {
                // Create log
                logController.createLog(user.user_id, function (status) {
                    console.log(status);
                    if (status == 200) {
                        // User successfully created
                        console.log('success', user.user_id);
                        return utils.res(res, 200, "Account Created Successfully!")
                    } else {
                        // Delete the user again
                        models.User.findOneAndDelete({
                            'user_id': user.user_id
                        }, function (err, deletedUser) {
                            // Irrespective of deletion status, report Error
                            return utils.res(res, 400, 'User ID already exists');
                        });
                    }
                });
            })
            .catch(function (err) {
                if (err.code == 11000) {
                    return utils.res(res, 400, 'User ID already exists');
                } else {
                    return utils.res(res, 500, 'Internal Server Error');
                }
            });
    });
}

/** Creating the admin */
function createAdmin(req, res) {
    console.log(config.admin_secret);
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    // Check Request Body
    const user = req.body;
    if (user == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (user.user_id == null || user.name == null || user.email == null || user.password == null || user.admin_secret == null) {
        return utils.res(res, 400, 'Bad Request, Incomplete Information');
    }

    // Validate user input
    if (config.nameRegex.test(user.user_id)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'User ID should contain only alphanumeric and [ _ - ] characters');
    }

    if (!user.email.match(config.emailRegex)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Please enter a valid email address');
    }

    if (!config.passwordRegex.test(user.password)) {
        // Contains dangerous special characters
        let msg = 'Password should be of 8-13 characters, ' +
            'at least one uppercase letter, one lowercase letter, one number and one special character from @$!%*?&';
        return utils.res(res, 400, msg);
    }

    if (!config.adminSecretRegex.test(user.admin_secret)) {
        // Contains dangerous special characters
        return utils.res(res, 401, 'Incorrect Admin Secret');
    }

    if (config.textRegex.test(user.name)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Name should contain alphanumeric characters only');
    }

    // Check the validity of Admin_Secret
    bcrypt.compare(user.admin_secret, config.admin_secret, function (err, verdict) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (!verdict) {
            return utils.res(res, 401, 'Incorrect Admin Secret');
        }

        // Successful authentication
        // Hash the password and then create the user
        bcrypt.hash(user.password, saltRounds, (err, hash) => {
            if (err) {
                return utils.res(res, 500, 'Internal Server Error');
            }

            let db_user = {
                "user_id": user.user_id,
                "password": hash,
                "name": user.name,
                "email": user.email,
                "security_question": {
                    "question_id": "admin10",
                    "answer": "Yes"
                },
                "role": "admin",
                "levels": {}, // No level for new user
                "assessments": {} // No assessment for new user
            };

            // Leave coins and user_IQ at default values
            // Insert into DB
            let newUser = new models.User(db_user);
            newUser.save()
                .then(function () {
                    // User successfully created
                    return utils.res(res, 200, "Account Created Successfully!")
                })
                .catch(function (err) {
                    if (err.code == 11000) {
                        return utils.res(res, 400, 'User ID already exists');
                    } else {
                        return utils.res(res, 500, 'Internal Server Error');
                    }
                });
        });
    });
}

/** Logging in the user */
function login(req, res) {
    if (req == null || req.body == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    let user = req.body;
    if (user.user_id == null) {
        user.user_id = user.username;
    }

    if (user.user_id == null || config.nameRegex.test(user.user_id)) {
        // Either invalid or dangerous
        return utils.res(res, 400, 'Bad Request, Incorrect Username');
    }

    if (user.password == null) {
        return utils.res(res, 400, 'Bad Request');
    }
    if (!config.passwordRegex.test(user.password)) {
        // Either invalid or dangerous
        console.log(user.password);
        return utils.res(res, 401, 'Incorrect Password');
    }

    // Fetch the user and check if password is correct
    // Find in the database
    models.User.findOne({
        'user_id': user.user_id
    }, function (err, loggedUser) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (loggedUser == null) {
            // No such record
            return utils.res(res, 401, 'Username does not exist');
        }

        // Compare passwords
        bcrypt.compare(user.password, loggedUser.password, function (err, verdict) {
            if (err) {
                return utils.res(res, 500, 'Internal Server Error');
            }

            if (!verdict) {
                return utils.res(res, 401, 'Incorrect Password');
            }

            // Successful login
            const payload = {
                'user_id': loggedUser.user_id,
                'name': loggedUser.name
            }

            const token = jwt.sign(payload, config.jwtSecret, {
                expiresIn: config.jwtExpiry
            });

            const userInfo = {
                'name': loggedUser.name,
                'university': loggedUser.university || "Not Provided",
                'total_coins': loggedUser.total_coins,
                'cyber_IQ': loggedUser.cyber_IQ,
                'levels': loggedUser.levels,
                'assessments': loggedUser.assessments
            }

            return utils.res(res, 200, 'Login Successful', {
                'token': token,
                'user': userInfo,
                'admin': (loggedUser.role === 'admin') ? 'admin' : 'player'
            });
        });
    });
}

/** Viewing the basic user info */
function viewSelf(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    // Fetch the user info
    models.User.findOne({
        'user_id': req.user_id
    }, 'user_id name email university total_coins cyber_IQ', function (err, loggedUser) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (loggedUser == null) {
            return utils.res(res, 401, 'Invalid Token');
        }

        const user = {
            'user_id': loggedUser.user_id,
            'name': loggedUser.name,
            'email': loggedUser.email,
            'university': loggedUser.university || 'NA',
            'total_coins': loggedUser.total_coins,
            'cyber_IQ': loggedUser.cyber_IQ,
        }

        return utils.res(res, 200, 'Retrieval Successful', user);
    });
}

/** Updating the user */
function updateSelf(req, res) {
    if (req == null || req.body == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    const user = req.body;

    if (user.name == null || user.email == null) {
        return utils.res(res, 400, 'Bad Request, Incomplete Information');
    }

    // Validate user input
    if (!user.email.match(config.emailRegex)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Please enter a valid email address');
    }

    if (config.textRegex.test(user.name)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Please enter alphanumeric characters only');
    }

    if ((!(user.university == null)) && config.textRegex.test(user.university)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'University Name should not contain special characters');
    }

    let updatedUser = {};
    updatedUser['name'] = user.name;
    updatedUser['email'] = user.email;
    if (!(user.university == null)) {
        updatedUser['university'] = user.university;
    }

    // Update the user info
    models.User.findOneAndUpdate({
        'user_id': req.user_id
    }, updatedUser, function (err, oldUser) {
        if (err || oldUser == null) {
            return utils.res(res, 401, 'Account Does not exist');
        }

        return utils.res(res, 200, 'Profile updated successfully!', {
            name: user.name
        });
    });
}

/** Deleting the user */
function deleteSelf(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    // Delete the user
    models.User.findOneAndDelete({
        'user_id': req.user_id
    }, function (err, deletedUser) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (deletedUser == null) {
            return utils.res(res, 401, 'Invalid');
        }

        // Successfull Deletion
        return utils.res(res, 200, 'Your account is deleted successfully');
    });
}

/** Reseting the password */
function resetPassword(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    const user = req.body;

    if (user.old_password == null || user.new_password == null) {
        return utils.res(res, 400, 'Bad Request, Incomplete Information');
    }

    if (!config.passwordRegex.test(user.old_password) || !config.passwordRegex.test(user.new_password)) {
        // Contains dangerous special characters
        let msg = 'Password should be of 8-13 characters, ' +
            'at least one uppercase letter, one lowercase letter, one number and one special character from @$!%*?&';
        return utils.res(res, 400, msg);
    }

    // Fetch the user info
    models.User.findOne({
        'user_id': req.user_id
    }, 'password', function (err, loggedUser) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (loggedUser == null) {
            return utils.res(res, 401, 'Invalid Token');
        }

        // Compare passwords
        bcrypt.compare(user.old_password, loggedUser.password, function (err, verdict) {
            if (err) {
                return utils.res(res, 500, 'Internal Server Error');
            }

            if (!verdict) {
                return utils.res(res, 401, 'Incorrect Password');
            }

            // Successful validation
            // Hash the new password and then return new token
            bcrypt.hash(user.new_password, saltRounds, (err, hash) => {
                if (err) {
                    return utils.res(res, 500, 'Internal Server Error');
                }

                // Update into DB
                models.User.findOneAndUpdate({
                    'user_id': req.user_id
                }, {
                        'password': hash
                    }, function (err, updatedUser) {
                        if (err || updatedUser == null) {
                            // Some problem occured
                            // console.log(err);
                            return utils.res(res, 500, 'Internal Server Error');
                        }

                        // Password changed successfully
                        const payload = {
                            'user_id': updatedUser.user_id,
                            'name': updatedUser.name
                        }

                        const token = jwt.sign(payload, config.jwtSecret, {
                            expiresIn: config.jwtExpiry
                        });

                        return utils.res(res, 200, 'Password Reset Successfully', {
                            'token': token,
                        });
                    });

            });
        });
    });
}

/** Get the List of all users */
function listUsers(req, res) {
    if (req == null || req.query == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    try {
        // Pagination
        const range = JSON.parse(req.query.range);
    } catch (err) {
        return utils.res(res, 400, 'Please provide appropriate range');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    // Fetch User lists
    models.User.find({}, 'user_id name email university total_coins cyber_IQ role')
        .lean()
        .exec(function (err, users) {
            if (err) {
                return utils.res(res, 500, 'Internal Server Error');
            }

            if (users == null) {
                return utils.res(res, 404, 'Users do not Exist');
            }
            users.map(u => {
                u['id'] = u['user_id'];
                delete u['user_id'];
                delete u['_id'];
                if (!u['university']) {
                    u['university'] = 'NA';
                }
                return u;
            });

            // Pagination
            const range = JSON.parse(req.query.range);
            const len = users.length;
            const response = users.slice(range[0], range[1] + 1);
            const contentRange = 'users ' + range[0] + '-' + range[1] + '/' + len;

            res.set({
                'Access-Control-Expose-Headers': 'Content-Range',
                'Content-Range': contentRange
            });
            return utils.res(res, 200, 'Retrieval Successful', response);
        })
}

/** Admin Viewing the user info */
function viewUser(req, res) {
    if (req == null || req.params == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.params.id == null) {
        return utils.res(res, 400, 'Please provide user_id of user to fetch');
    }

    // Fetch the user info
    models.User.findOne({
        'user_id': req.params.id
    }, 'user_id name role email university total_coins cyber_IQ')
        .lean()
        .exec(function (err, user) {
            if (err || user == null) {
                return utils.res(res, 404, 'Such user does not exist');
            }

            user['id'] = user['user_id'];
            delete user['user_id'];
            delete user['_id'];
            if (!user['university']) {
                user['university'] = 'NA';
            }

            return utils.res(res, 200, 'Retrieval Successful', user);
        });
}

/** Admin Deleting the user */
function deleteUser(req, res) {
    if (req == null || req.params == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.params.id == null) {
        return utils.res(res, 400, 'Please provide user_id of user to delete');
    }

    // Delete the user
    models.User.findOneAndDelete({
        'user_id': req.params.id
    }, function (err, deletedUser) {
        if (err || deletedUser == null) {
            return utils.res(res, 401, 'Such user does not exist');
        }

        // Successfull Deletion
        return utils.res(res, 200, 'User account deleted successfully');
    });
}

/** Fogot Password */
function forgotPassword(req, res) {
    if (req == null || req.body == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    const user = req.body;

    if (user.user_id == null || config.nameRegex.test(user.user_id)) {
        // Either invalid or dangerous
        return utils.res(res, 400, 'Bad Request, Incorrect Username');
    }

    if (user.security_question == null || user.security_answer == null) {
        return utils.res(res, 400, 'Bad Request, Missing Security Question or Answer');
    }

    if (user.new_password == null) {
        return utils.res(res, 400, 'Bad Request, Incomplete Information');
    }

    if (!config.passwordRegex.test(user.new_password)) {
        // Contains dangerous special characters
        let msg = 'Password should be of 8-13 characters, ' +
            'at least one uppercase letter, one lowercase letter, one number and one special character from @$!%*?&';
        return utils.res(res, 400, msg);
    }

    // Fetch the user and check if password is correct
    // Find in the database
    models.User.findOne({
        'user_id': user.user_id
    }, function (err, loggedUser) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (loggedUser == null) {
            // No such record
            return utils.res(res, 401, 'Username does not exist');
        }

        // Check security question
        if (user.security_question != loggedUser.security_question.question_id) {
            return utils.res(res, 401, 'Incorrect Answer');
        }

        // Check security answer
        if (user.security_answer != loggedUser.security_question.answer) {
            return utils.res(res, 401, 'Incorrect Answer');
        }

        // Successful validation
        // Hash the new password and then return new token
        bcrypt.hash(user.new_password, saltRounds, (err, hash) => {
            if (err) {
                return utils.res(res, 500, 'Internal Server Error');
            }

            // Update into DB
            models.User.findOneAndUpdate({
                'user_id': user.user_id
            }, {
                    'password': hash
                }, function (err, updatedUser) {
                    if (err || updatedUser == null) {
                        // Some problem occured
                        // console.log(err);
                        return utils.res(res, 500, 'Internal Server Error');
                    }

                    // Password changed successfully
                    return utils.res(res, 200, 'Password Reset Successfully');
                });
        });
    });
}


module.exports = {
    'listUsers': listUsers,
    'viewUser': viewUser,
    'deleteUser': deleteUser,

    'forgotPassword': forgotPassword,

    'createUser': createUser,
    'createAdmin': createAdmin,
    'login': login,
    'viewSelf': viewSelf,
    'updateSelf': updateSelf,
    'deleteSelf': deleteSelf,
    'resetPassword': resetPassword
    // 'createLevelAdmin': createLevelAdmin,
}