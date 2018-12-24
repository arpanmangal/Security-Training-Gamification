const config = require('../config/config');
const utils = require('../utils');
const jwt = require('jsonwebtoken');

const models = require('../models/models');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

/** List all the levels */
function listLevels(req, res) {
    if (req == null || req.query == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    try {
        // Pagination
        const range = JSON.parse(req.query.range);
        const r0 = range[0], r1 = range[1] + 1;

        // Sort
        const sorting = JSON.parse(req.query.sort);
        const sortPara = sorting[0];
        const sortOrder = sorting[1];

        // Filter
        const filter = JSON.parse(req.query.filter);
    } catch (err) {
        return utils.res(res, 400, 'Please provide appropriate range, sort & filter arguments');
    }

    let qFilter = JSON.parse(req.query.filter);
    let filter = {};
    if (!(qFilter.category == null) && typeof(qFilter.category) === 'string') filter['category'] = qFilter.category;
    if (!(qFilter.difficulty == null) && typeof(qFilter.difficulty) === 'string') filter['difficulty'] = qFilter.difficulty;
    if (!(qFilter.type == null) && typeof(qFilter.type) === 'string') filter['type'] = qFilter.type;
    if (!(qFilter.name == null) && typeof(qFilter.name) === 'string') filter['name'] = { $regex: qFilter.name, $options: 'i' };

    // Fetch the level info
    models.level.find(filter, '_id name subheading category description difficulty type image_url game_url qualification_iq rules')
        .lean()
        .exec(function (err, levels) {
            if (err) {
                return utils.res(res, 500, 'Internal Server Error');
            }

            if (levels == null) {
                return utils.res(res, 404, 'No Such Level Exists');
            }
            levels.map(l => {
                l['id'] = l['name'];
                return l;
            });

            // Pagination
            const range = JSON.parse(req.query.range);
            const len = levels.length;
            const response = levels.slice(range[0], range[1] + 1);
            const contentRange = 'levels ' + range[0] + '-' + range[1] + '/' + len;

            // Sort
            const sorting = JSON.parse(req.query.sort);
            let sortPara = sorting[0] || 'name';
            let sortOrder = sorting[1] || 'ASC';
            if (sortOrder !== 'ASC' && sortOrder != 'DESC') sortOrder = 'ASC';

            res.set({
                'Access-Control-Expose-Headers': 'Content-Range',
                'Content-Range': contentRange
            })

            return utils.res(res, 200, 'Retrieval Successful', utils.sortObjects(response, sortPara, sortOrder));
        });
}


/** Create new level */
function createLevel(req, res) {
    if (req == null || req.body == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    // check request body
    const level = req.body;
    if (level.name == null || level.subheading == null || level.category == null || level.difficulty == null ||
        level.type == null || level.image_url == null || level.qualification_iq == null || level.level_secret == null) {
        return utils.res(res, 400, 'Bad Request, Incomplete Information');
    }

    // Validate level input
    if (config.nameRegex.test(level.name)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Level Name should contain only alphanumeric and [ _ - ] characters');
    }

    if (config.nameRegex.test(level.category)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Category should contain only alphanumeric and [ _ - ] characters');
    }

    // Maybe write in the specific values that difficulty can have as a check
    if (config.alphaNumericRegex.test(level.difficulty)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Difficulty should contain only alphanumeric characters');
    }

    // Maybe write in the specific values that type can have as a check
    if (config.alphaNumericRegex.test(level.type)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Level Type should contain only alphanumeric characters');
    }

    if (level.isAvailable !== null && level.isAvailable !== undefined && typeof(level.isAvailable) !== 'boolean') {
        return utils.res(res, 400, 'isAvailable should be boolean');
    }

    // if (config.urlRegex.test(level.image_url)) {
    //     // Contains dangerous special characters
    //     return utils.res(res, 400, 'Invalid Image URL');
    // }

    if (level.game_url == null) level.game_url = '#';

    // Hash the secret and then create the level
    bcrypt.hash(level.level_secret, saltRounds, (err, hash) => {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }
        console.log(hash);
        let db_level = {
            "name": level.name,
            "subheading": level.subheading,
            "category": level.category,
            "difficulty": level.difficulty,
            "level_secret": hash,
            "type": level.type,
            "description": '',
            "image_url": level.image_url,
            "game_url": level.game_url,
            "qualification_iq": level.qualification_iq,
            "isAvailable": level.isAvailable || false,
            "rules": [],
            "hints": [],
            "players": [],
            "leaderboard": {}, // No level for new user
            "attributes": {} // No assessment for new user
        };

        if (!(level.description == null)) db_level["description"] = level.description;
        if (!(level.rules == null) && level.rules.length > 0) db_level["rules"] = level.rules;
        if (!(level.hints == null) && level.hints.length > 0) db_level["hints"] = level.hints;
        if (!(level.attributes == null)) db_level["attributes"] = level.attributes;

        let newLevel = new models.level(db_level);
        newLevel.save()
            .then(function () {
                // Level successfully created
                return utils.res(res, 200, 'Level Registered Successfully', {
                    '_id': newLevel.name
                });
            })
            .catch(function (err) {
                if (err.code == 11000) {
                    console.log(err);
                    return utils.res(res, 400, 'Level already exists');
                } else {
                    return utils.res(res, 500, 'Internal Server Error');
                }
            });
    });
}


/** Viewing the basic level info */
function viewLevel(req, res) {
    if (req == null || req.params == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.params.name == null) {
        return utils.res(res, 401, 'Invalid Level name');
    }

    // Fetch the user info
    models.level.findOne({
        'name': req.params.name
    }, '_id name subheading category type difficulty description image_url game_url rules hints qualification_iq attributes', function (err, mylevel) {
        if (err || mylevel == null) {
            // console.log(err);
            return utils.res(res, 404, 'Level does not exist');
        }

        const lev = {
            'name': mylevel.name,
            'subheading': mylevel.subheading,
            'category': mylevel.category,
            'type': mylevel.type,
            'difficulty': mylevel.difficulty,
            'description': mylevel.description || '',
            'image_url': mylevel.image_url,
            'game_url': mylevel.game_url,
            'rules': mylevel.rules || [],
            'hints': mylevel.hints || [],
            'qualification_iq': mylevel.qualification_iq,
            'attributes': mylevel.attributes || {},
        }

        return utils.res(res, 200, 'Retrieval Successful', lev);
    });
}


/** Modifying the level info */
function modifyLevel(req, res) {
    if (req == null || req.params == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.params.name == null) {
        return utils.res(res, 400, 'Provide Level name');
    }

    const level = req.body;
    let updatedLevel = {}

    if (!(level.subheading == null)) {
        updatedLevel.subheading = level.subheading;
    }
    if (!(level.category == null)) {
        if (config.nameRegex.test(level.category))
            return utils.res(res, 400, 'Category should contain only alphanumeric and [ _ - ] characters');
        else
            updatedLevel.category = level.category;
    }
    if (!(level.difficulty == null)) {
        if (config.alphaNumericRegex.test(level.difficulty))
            return utils.res(res, 400, 'Difficulty should contain only alphanumeric characters');
        else
            updatedLevel.difficulty = level.difficulty;
    }
    if (!(level.type == null)) {
        if (config.alphaNumericRegex.test(level.type))
            return utils.res(res, 400, 'Level Type should contain only alphanumeric characters');
        else
            updatedLevel.type = level.type;
    }
    if (!(level.description == null)) {
        updatedLevel.description = level.description;
    }
    if (!(level.image_url == null)) {
        // if (config.urlRegex.test(level.image_url))
        //     return utils.res(res, 400, 'Invalid Image URL');
        // else
        updatedLevel.image_url = level.image_url;
    }

    if (!(level.game_url == null)) {
        updatedLevel.game_url = level.game_url;
    }
    if (!(level.rules == null)) {
        if (!Array.isArray(level.rules))
            return utils.res(res, 400, 'Rules should be an Array');
        else
            updatedLevel.rules = level.rules;
    }
    if (!(level.hints == null)) {
        if (!Array.isArray(level.hints))
            return utils.res(res, 400, 'Hints should be an Array');
        else
            updatedLevel.hints = level.hints;
    }
    if (!(level.qualification_iq == null)) {
        updatedLevel.qualification_iq = level.qualification_iq;
    }
    if (!(level.attributes == null)) {
        if (!typeof (level.attributes) === 'object')
            return utils.res(res, 400, 'Attributes should be an Object');
        else
            updatedLevel.attributes = level.attributes;
    }
    if (level.isAvailable !== null && level.isAvailable !== undefined && typeof(level.isAvailable) === 'boolean') {
        updatedLevel.isAvailable = level.isAvailable;
    }

    // Update the level info
    console.log(req.params.name)
    models.level.findOneAndUpdate({ 'name': req.params.name }, updatedLevel, { new: true }, function (err, newLevel) {
        if (err || newLevel == null) {
            return utils.res(res, 400, 'Level Does not exist');
        }

        return utils.res(res, 200, 'Record Updated Successfully', newLevel);
    });
}


/** Modifying the level info */
function modify_secret(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.body.name == null) {
        return utils.res(res, 400, 'Provide Level name');
    }

    const level = req.body;
    let updatedLevel = {}

    if (level.old_secret == null) {
        return utils.res(res, 400, 'Please, enter your old password');
    }else{
        if (config.adminSecretRegex.test(level.old_secret)){
            return utils.res(res, 400, 'old_password doesn\'t match');
        }else{
            // Fetch the level info
            models.level.findOne({
                'name': level.name
            }, 'name level_secret', function (err, mylevel) {
                if (err) {
                    return utils.res(res, 500, 'Internal Server Error');
                }

                if (mylevel == null) {
                    return utils.res(res, 401, 'Invalid name provided');
                }

                // Compare passwords
                bcrypt.compare(level.old_secret, mylevel.level_secret, function (err, verdict) {
                    if (err) {
                        return utils.res(res, 500, 'Internal Server Error');
                    }

                    if (!verdict) {
                        return utils.res(res, 401, 'Incorrect Secret');
                    }

                    // Successful validation
                    // Hash the new password and then return new token
                    bcrypt.hash(level.new_secret, saltRounds, (err, hash) => {
                        if (err) {
                            return utils.res(res, 500, 'Internal Server Error');
                        }

                        // Update the level info
                        models.level.findOneAndUpdate({ 'name': req.body.name }, {'level_secret': hash}, { new: true }, function (err, newLevel) {
                            if (err || newLevel == null) {
                                return utils.res(res, 400, 'Level Does not exist');
                            }

                            return utils.res(res, 200, 'Record Updated Successfully', newLevel);
                        });
                    });
                });
            });            
        }
    }
}


/** Admin Deleting the level */
function deleteLevel(req, res) {
    if (req == null || req.params == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid User id');
    }

    if (req.params.name == null) {
        return utils.res(res, 400, 'Please provide name of level to delete');
    }

    // Delete the user
    models.level.findOneAndDelete({
        'name': req.params.name
    }, function (err, deletedLevel) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }
        if (deletedLevel == null) {
            return utils.res(res, 401, 'Such level does not exist');
        }

        // Successfull Deletion
        return utils.res(res, 200, 'Level deleted successfully');
    });
}


/******* Leaderboard API ********/
function getLeaderboard(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.body.name == null) {
        return utils.res(res, 401, 'Level name undefined');
    }

    // Fetch the level info
    models.level.findOne({
        'name': req.body.name
    }, 'name leaderboard', function (err, mylevel) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (mylevel == null) {
            return utils.res(res, 401, 'Invalid type provided');
        }
        var arr = {};
        console.log(mylevel);
        var lead = sortProperties(mylevel.leaderboard);
        console.log(lead)
        var leng = Math.min(10, lead.length);
        console.log(lead[0][0]);
        for (var i = 0; i < leng; i++) {
            arr[lead[i][0]] = lead[i][1];
        }
        console.log(arr);
        const lev = {
            'name': mylevel.name,
            'leaderboard': arr,
        }
        return utils.res(res, 200, 'Retrieval Successful', lev);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function sortProperties(obj) {
    // convert object into array
    var sortable = [];
    for (var key in obj)
        if (obj.hasOwnProperty(key))
            sortable.push([key, obj[key]]); // each item is an array in format [key, value]

    // sort items by value
    sortable.sort(function (a, b) {
        return a[1] - b[1]; // compare numbers
    });
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}


/** Viewing the level info */
function getAttributes(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.body.name == null) {
        return utils.res(res, 401, 'Invalid Level name');
    }

    if ((req.body.keys == null) || (req.body.len == null)) {
        return utils.res(res, 401, 'Content to fetch not sent');
    }

    var my_key = req.body.keys.split(",");
    var my_len = req.body.len.split(",").map(Number);
    console.log("Yo: " + my_key);
    console.log("Yo again: " + my_len);

    if (my_key.length != my_len.length) {
        return utils.res(res, 401, 'Length of content mismatch');
    }

    // Fetch the level info
    models.level.findOne({
        'name': req.body.name
    }, 'attributes', function (err, mylevel) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (mylevel == null) {
            return utils.res(res, 401, 'Invalid Token');
        }

        var attri = mylevel.attributes;
        var new_attri = {};
        // var my_key = req.body.keys;
        // var my_len = req.body.len;
        for (var i = 0; i < my_key.length; i++) {
            if (attri.hasOwnProperty(my_key[i])) {
                var leng = (attri[my_key[i]]).length;
                if (leng < my_len[i]) {
                    return utils.res(res, 401, 'Data size too large');
                }
                shuffleArray(attri[my_key[i]]);
                new_attri[my_key[i]] = [];
                for (var j = 0; j < my_len[i]; j++) {
                    new_attri[my_key[i]].push(attri[my_key[i]][j]);
                }
            }
        }
        return utils.res(res, 200, 'Retrieval Successful', new_attri);
    });
}


/** Viewing the level info */
function playerUpdate(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.body.name == null) {
        return utils.res(res, 401, 'Invalid Level name');
    }

    // Fetch the level info
    models.level.findOne({
        'name': req.body.name
    }, 'players', function (err, mylevel) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (mylevel == null) {
            return utils.res(res, 401, 'Invalid name');
        }

        var player = mylevel.players;
        player.push(req.user_id);

        models.level.findOneAndUpdate({ 'name': req.body.name }, { 'players': player }, { new: false }, function (err, updatelevel) {
            if (err) {
                return utils.res(res, 500, 'Internal Server Error');
            }
            return utils.res(res, 200, 'Update Successful');
        });
    });
}

module.exports = {
    'listLevels': listLevels,
    'viewLevel': viewLevel,
    'createLevel': createLevel,
    'modifyLevel': modifyLevel,
    'modify_secret': modify_secret,
    'deleteLevel': deleteLevel,

    'getAttributes': getAttributes,
    'playerUpdate': playerUpdate,
    'getLeaderboard': getLeaderboard
}