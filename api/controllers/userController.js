const config = require('../config/config');
const utils = require('../utils');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const models = require('../models/models');

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

    console.log(user);

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

    if (config.passwordRegex.test(user.password)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Password should contains only alphanumeric and [ @ # $ % * ] characters');
    }

    if (config.nameRegex.test(user.security_question_id)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Bad Request');
    }

    if (config.alphaNumericRegex.test(user.name) || config.alphaNumericRegex.test(user.security_answer)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Please enter alphanumeric characters only');
    }

    if ((!(user.university == null)) && config.alphaNumericRegex.test(user.university)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Please enter alphanumeric characters only');
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
        if (!(user.role == null) && user.role == "admin") db_user["role"] = "admin";

        // Insert into DB
        let newUser = new models.User(db_user);
        newUser.save()
            .then(function () {
                // User successfully created
                return utils.res(res, 200, "User Registered Successfully")
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

/** Logging in the user */
function login(req, res) {
    if (req == null || req.body == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    const user = req.body;

    if (user.user_id == null || config.nameRegex.test(user.user_id)) {
        // Either invalid or dangerous
        return utils.res(res, 400, 'Bad Request, Incorrect Username');
    }

    if (user.password == null || config.passwordRegex.test(user.password)) {
        // Either invalid or dangerous
        return utils.res(res, 400, 'Bad Request, Incorrect Password');
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
                'user': userInfo
            });
        });
    });
}

/** Viewing the basic user info */
function view(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    // Fetch the user info
    models.User.findOne({
        'user_id': req.user_id
    }, 'user_id name email university role total_coins cyber_IQ', function (err, loggedUser) {
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
            'university': loggedUser.university || 'Not Provided',
            'role': loggedUser.role,
            'total_coins': loggedUser.total_coins,
            'cyber_IQ': loggedUser.cyber_IQ,
        }

        return utils.res(res, 200, 'Retrieval Successful', user);
    });
}

/** Admin Viewing the user info */
function adminViewUser(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.requested_user_id == null) {
        return utils.res(res, 400, 'Please provide user_id of user to fetch');
    }

    // Fetch the user info
    models.User.findOne({
        'user_id': req.requested_user_id
    }, function (err, loggedUser) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (loggedUser == null) {
            return utils.res(res, 401, 'Such user does not exist');
        }

        // Compile all info
        const user = {
            'user_id': loggedUser.user_id,
            'name': loggedUser.name,
            'email': loggedUser.email,
            'university': loggedUser.university,
            'role': loggedUser.role,
            'total_coins': loggedUser.total_coins,
            'cyber_IQ': loggedUser.cyber_IQ,
            'levels': loggedUser.levels || {},
            'assessments': loggedUser.assessments || {}
        }

        return utils.res(res, 200, 'Retrieval Successful', user);
    });
}

/** Deleting the user */
function deleteUser(req, res) {
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

/** Admin Deleting the user */
function adminDeleteUser(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.requested_user_id == null) {
        return utils.res(res, 400, 'Please provide user_id of user to fetch');
    }

    // Delete the user
    models.User.findOneAndDelete({
        'user_id': req.requested_user_id
    }, function (err, deletedUser) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (deletedUser == null) {
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

    if (config.passwordRegex.test(user.new_password)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Password should contains only alphanumeric and [ @ # $ % * ] characters');
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
                    if (err) {
                        // Some problem occured
                        console.log(err);
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
                        'name': updatedUser.name
                    });
                });
        });
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

    if (config.passwordRegex.test(user.old_password) || config.passwordRegex.test(user.new_password)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Password should contains only alphanumeric and [ @ # $ % * ] characters');
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
                        if (err) {
                            // Some problem occured
                            console.log(err);
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


module.exports = {
    'createUser': createUser,
    'login': login,
    'viewUser': view,
    'adminViewUser': adminViewUser,
    'deleteUser': deleteUser,
    'adminDeleteUser': adminDeleteUser,
    'forgotPassword': forgotPassword,
    'resetPassword': resetPassword
}