const config = require('../config/config');
const utils = require('../utils');
const jwt = require('jsonwebtoken');

const models = require('../models/models');

function createLevel(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    // Check Request Body
    const level = req.body;
    if (level == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (level.name == null || level.subheading == null || level.category == null || level.difficulty == null ||
        level.type == null || level.image_url == null || level.qualification_iq == null) {
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

    if (config.urlRegex.test(level.image_url)) {
        // Contains dangerous special characters
        return utils.res(res, 400, 'Invalid Image URL');
    }

    let db_level = {
        "name": level.name,
        "subheading": level.subheading,
        "category": level.category,
        "difficulty": level.difficulty,
        "type": level.type,
        "description": '',
        "image_url": level.image_url,
        "qualification_iq": level.qualification_iq,
        "rules": [],
        "hints": [],
        "players": [],
        "leaderboard": [], // No level for new user
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
            return utils.res(res, 200, "Level Registered Successfully")
        })
        .catch(function (err) {
            if (err.code == 11000) {
                // console.log(err);
                return utils.res(res, 400, 'Level ID already exists');
            } else {
                return utils.res(res, 500, 'Internal Server Error');
            }
        });
}

function listLevels(req, res) {
    if (req == null || req.body == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    // if (req.user_id == null) {
    //     return utils.res(res, 401, 'Invalid Token');
    // }

    // Fetch the level info
    models.level.find({}, '_id name subheading category difficulty type image_url qualification_iq')
        .lean()
        .exec(function (err, mylevel) {
            if (err) {
                return utils.res(res, 500, 'Internal Server Error');
            }

            if (mylevel == null) {
                return utils.res(res, 404, 'No Such Level Exists');
            }
            const levs = mylevel.map(l => {
                l['id'] = l['_id'];
                delete l['_id'];
                return l;
            });
            console.log(mylevel);
            console.log(levs);
            res.set({
                'Access-Control-Expose-Headers': 'Content-Range',
                'Content-Range': 'posts 0-24/319'
            })
            return utils.res(res, 200, 'Retrieval Successful', mylevel);
        });
}

/** Admin Deleting the level */
function deleteLevel(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid User id');
    }

    if (req.body.id == null) {
        return utils.res(res, 400, 'Please provide level_id of level to delete');
    }

    // Delete the user
    models.level.findOneAndDelete({
        '_id': req.body.id
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


/** Viewing the basic level info */
function browser_view(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.body.id == null) {
        return utils.res(res, 401, 'Invalid Level ID');
    }

    // Fetch the user info
    models.level.findOne({
        '_id': req.body.id
    }, 'level_id name subheading category type difficulty description image_url rules hints qualification_iq', function (err, mylevel) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (mylevel == null) {
            return utils.res(res, 401, 'Invalid Token');
        }

        const lev = {
            'name': mylevel.name,
            'subheading': mylevel.subheading,
            'category': mylevel.category,
            'type': mylevel.type,
            'difficulty': mylevel.difficulty,
            'description': mylevel.description,
            'image_url': mylevel.image_url,
            'rules': mylevel.rules,
            'hints': mylevel.hints,
            'qualification_iq': mylevel.qualification_iq,
        }

        return utils.res(res, 200, 'Retrieval Successful', lev);
    });
}

/** Viewing the level info */
function getAttributes(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.body.id == null) {
        return utils.res(res, 401, 'Invalid Level ID');
    }

    // Fetch the level info
    models.level.findOne({
        '_id': req.body.id
    }, 'attributes', function (err, mylevel) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (mylevel == null) {
            return utils.res(res, 401, 'Invalid Token');
        }

        var attri = mylevel.attributes;
        for (key in attri) {
            if (attri.hasOwnProperty(key)) {
                var len = (attri[key]).length;
                var index = Math.floor(Math.random() * (len));
                attri[key] = attri[key][index]
            }
        }
        return utils.res(res, 200, 'Retrieval Successful', attri);
    });
}

function getCategories(req, res) {
    if (req == null || req.body == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.body.category == null) {
        return utils.res(res, 401, 'Invalid category');
    }

    // Fetch the level info
    models.level.find({
        'category': req.body.category
    }, 'name _id difficulty type image_url qualification_iq', function (err, mylevel) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (mylevel == null) {
            return utils.res(res, 401, 'Invalid category provided');
        }
        const levs = mylevel;
        console.log(req.body.category);
        console.log(mylevel);
        console.log(levs);
        // const lev = {
        //           '_id': mylevel[0]._id,
        //           'name': mylevel[0].name,
        //           'type': mylevel[0].type,
        //           'difficulty': mylevel[0].difficulty,
        //           'image_url': mylevel[0].image_url,
        //           'qualification_iq': mylevel[0].qualification_iq,
        //       }
        return utils.res(res, 200, 'Retrieval Successful', mylevel);
    });
}


function getType(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.body.type == null) {
        return utils.res(res, 401, 'Type undefined');
    }

    // Fetch the level info
    models.level.find({
        'type': req.body.type
    }, 'name _id category difficulty image_url qualification_iq', function (err, mylevel) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (mylevel == null) {
            return utils.res(res, 401, 'Invalid type provided');
        }
        // console.log(req.body.type);
        // console.log(mylevel);
        // const lev = {
        //           '_id': mylevel[0]._id,
        //           'name': mylevel[0].name,
        //           'category': mylevel[0].category,
        //           'difficulty': mylevel[0].difficulty,
        //           'image_url': mylevel[0].image_url,
        //           'qualification_iq': mylevel[0].qualification_iq,
        //       }
        return utils.res(res, 200, 'Retrieval Successful', mylevel);
    });
}

function modifyLevel(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.body.id == null) {
        return utils.res(res, 401, 'level_id undefined');
    }

    const lev = {
        'name': "",
        'subheading': "",
        'category': "",
        'difficulty': "",
        'type': "",
        'description': "",
        'image_url': "",
        'rules': [],
        'hints': [],
        'qualification_iq': "",
        'players': [],
        'leaderboard': [],
        'attributes': {},
    }

    if (!(req.body.name == null)) {
        lev.name = req.body.name;
    }
    if (!(req.body.subheading == null)) {
        lev.subheading = req.body.subheading;
    }
    if (!(req.body.category == null)) {
        lev.category = req.body.category;
    }
    if (!(req.body.difficulty == null)) {
        lev.difficulty = req.body.difficulty;
    }
    if (!(req.body.type == null)) {
        lev.type = req.body.type;
    }
    if (!(req.body.description == null)) {
        lev.description = req.body.description;
    }
    if (!(req.body.image_url == null)) {
        lev.image_url = req.body.image_url;
    }
    if (!(req.body.rules == null)) {
        lev.rules = req.body.rules;
    }
    if (!(req.body.hints == null)) {
        lev.hints = req.body.hints;
    }
    if (!(req.body.qualification_iq == null)) {
        lev.qualification_iq = req.body.qualification_iq;
    }
    if (!(req.body.players == null)) {
        lev.players = req.body.players;
    }
    if (!(req.body.leaderboard == null)) {
        lev.leaderboard = req.body.leaderboard;
    }
    if (!(req.body.attributes == null)) {
        lev.attributes = req.body.attributes;
    }

    // Fetch the level info
    models.level.findOneAndUpdate({ '_id': req.body.id }, lev, { new: true }, function (err, mylevel) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (mylevel == null) {
            return utils.res(res, 401, 'Invalid type provided');
        }

        const new_lev = {
            'name': mylevel.name,
            'subheading': mylevel.subheading,
            'category': mylevel.category,
            'difficulty': mylevel.difficulty,
            'type': mylevel.type,
            'description': mylevel.description,
            'image_url': mylevel.image_url,
            'rules': mylevel.rules,
            'hints': mylevel.hints,
            'qualification_iq': mylevel.qualification_iq,
            'players': mylevel.players,
            'leaderboard': mylevel.leaderboard,
            'attributes': mylevel.attributes,
        }
        return utils.res(res, 200, 'Retrieval Successful', new_lev);
    });
}

function getLeaderboard(req, res) {
    if (req == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.user_id == null) {
        return utils.res(res, 401, 'Invalid Token');
    }

    if (req.body.id == null) {
        return utils.res(res, 401, 'Level Id undefined');
    }

    // Fetch the level info
    models.level.find({
        '_id': req.body.id
    }, 'name leaderboard', function (err, mylevel) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (mylevel == null) {
            return utils.res(res, 401, 'Invalid type provided');
        }

        const lev = {
            'name': mylevel.name,
            'leaderboard': mylevel.leaderboard,
        }
        return utils.res(res, 200, 'Retrieval Successful', lev);
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

    if (req.body.id == null) {
        return utils.res(res, 401, 'Invalid Level ID');
    }

    // Fetch the level info
    models.level.findOne({
        '_id': req.body.id
    }, 'players', function (err, mylevel) {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        if (mylevel == null) {
            return utils.res(res, 401, 'Invalid Token');
        }

        var player = mylevel.players;
        player.push(req.user_id);

        models.level.findOneAndUpdate({ '_id': req.body.id }, { 'players': player }, { new: false }, function (err, updatelevel) {
            if (err) {
                return utils.res(res, 500, 'Internal Server Error');
            }
            return utils.res(res, 200, 'Update Successful');
        });
    });
}

module.exports = {
    'createLevel': createLevel,
    'listLevels': listLevels,
    'deleteLevel': deleteLevel,
    'modifyLevel': modifyLevel,
    'browser_view': browser_view,
    'getAttributes': getAttributes,
    'getCategories': getCategories,
    'playerUpdate': playerUpdate,
    'getType': getType,
    'getLeaderboard': getLeaderboard
}