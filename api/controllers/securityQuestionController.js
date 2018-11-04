const config = require('../config/config');
const utils = require('../utils');

const models = require('../models/models');

/** Adding a new question to the database */
function addQuestion(req, res) {
    if (req == null || req.body == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    if (req.body.question == null) {
        return utils.res(res, 400, 'No Question Provided');
    }

    // Insert into DB
    const question = {
        "content": req.body.question
    };
    let newQuestion = new models.SecurityQuestion(question);
    newQuestion.save()
        .then(function () {
            // Successfully Added
            return utils.res(res, 200, "Question Added Successfully");
        })
        .catch(function (err) {
            return utils.res(res, 500, 'Internal Server Error');
        })
}

/** Fetching all questions with their question IDs */
function view(req, res) {
    models.SecurityQuestion.find((err, questions) => {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        let result = [];
        questions.forEach(dbEntry => {
            result.push({
                question_id: dbEntry._id,
                content: dbEntry.content
            });
        });

        return utils.res(res, 200, "Fetched All Questions", result);
    });
}

function viewQuestion(req, res) {
    if (req == null || req.params == null || req.params.id == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    console.log('viewQues', req.params.id);

    models.SecurityQuestion.findById(req.params.id, function (err, question) {
        if (err || question == null) {
            // No such question
            return utils.res(res, 404, 'Question not found');
        }

        const result = {
            'content': question.content
        }

        return utils.res(res, 200, 'Question Fetched', result);
    });
}

module.exports = {
    'addQuestion': addQuestion,
    'view': view,
    'viewQuestion': viewQuestion
}