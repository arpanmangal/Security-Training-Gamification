/*
 * @Author: arpan.mangal 
 * @Date: 2018-09-09 17:23:05 
 * @Last Modified by: arpan.mangal
 * @Last Modified time: 2018-09-11 14:07:21
 */

const mongoose = require('mongoose');


// Creating the database schemas
const userSchema = new mongoose.Schema({
    user_id: {type: String, required: true, unique: true, dropDups: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    university: String,
    role: {type: String, required: true, default: "player"},
    total_coins: {type: Number, required: true, default: 100},
    cyber_IQ: {type: Number, required: true, default: 0},
    security_question: {type: {}, required: true},
    levels: {type: {}, required: true},
    assessments: {type: {}, required: true}
});

// Creating the database schemas
const levelSchema = new mongoose.Schema({
    // level_id: {type: String, required: true, unique: true, dropDups: true},
    name: {type: String, required: true, unique: true},
    subheading: {type: String},
    category: {type: String, required: true},
    difficulty: {type: String, required: true},
    type: {type: String, required: true},
    description: {type: String},
    image_url: {type: String, required: true},
    qualification_iq: {type: Number, required: true, default: 0},
    rules: {type: []},
    hints: {type: []},
    players: {type: []},
    leaderboard: {type: []},
    attributes: {type: {}}
});

const logSchema = new mongoose.Schema({
    user_id: {type: String, required: true, unique: true, dropDups: true},
    logs: {type: {}},
});

const securityQuestionSchema = new mongoose.Schema({
    content: {type: String, required: true}
})

// Creating the database models
const User = mongoose.model('User', userSchema);
const SecurityQuestion = mongoose.model('SecurityQuestion', securityQuestionSchema);
const level = mongoose.model('level', levelSchema);
const Logs = mongoose.model('Logs', logSchema);
// const Assessment = mongoose.model('Assessment', assessmentSchema);


// Exporting the schemas
module.exports = {
    User: User,
    // Assessment: Assessment,
    level: level,
    Logs: Logs,
    SecurityQuestion: SecurityQuestion
}
