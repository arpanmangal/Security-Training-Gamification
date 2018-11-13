const config = require('../config/config');
const utils = require('../utils');

const models = require('../models/models');

/** Adding a new question to the database */
function addQuestion(req, res) {
    if (req == null || req.body == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    /*** POTENTIAL VULNERABILITY */
    const ques = req.body.question;
    if (ques === null || ques === undefined) {
        return utils.res(res, 400, 'No Question Provided');
    }

    // Insert into DB
    const question = {
        "content": ques
    };
    let newQuestion = new models.SecurityQuestion(question);
    newQuestion.save()
        .then(function () {
            // Successfully Added
            return utils.res(res, 200, "Question Added Successfully", {
                '_id': newQuestion._id
            });
        })
        .catch(function (err) {
            // console.log(err);
            return utils.res(res, 500, 'Internal Server Error');
        })
}

/** Fetching all questions with their question IDs */
function view(req, res) {
    if (req == null || req.query == null) {
        return utils.res(res, 400, 'Bad Request');
    }

    try {
        // Pagination
        const range = JSON.parse(req.query.range);
    } catch (err) {
        req.query.range = '[0,9]';
    }

    models.SecurityQuestion.find((err, questions) => {
        if (err) {
            return utils.res(res, 500, 'Internal Server Error');
        }

        let result = [];
        let SNo = 1;
        questions.forEach(dbEntry => {
            result.push({
                id: dbEntry._id,
                SNo: SNo,
                content: dbEntry.content
            });
            SNo++;
        });

        // Pagination
        const range = JSON.parse(req.query.range);
        const len = result.length;
        const response = result.slice(range[0], range[1] + 1);
        const contentRange = 'questions ' + range[0] + '-' + range[1] + '/' + len;

        res.set({
            'Access-Control-Expose-Headers': 'Content-Range',
            'Content-Range': contentRange
        });

        return utils.res(res, 200, "Fetched All Questions", response);
    });
}

function viewQuestion(req, res) {
    if (req == null || req.params == null || req.params.id == null) {
        // console.log(req.params, req.params, req.body);
        return utils.res(res, 400, 'Bad Request');
    }

    models.SecurityQuestion.findById(req.params.id, function (err, question) {
        if (err || question == null) {
            // No such question
            return utils.res(res, 404, 'Question not found');
        }

        const result = {
            'id': question._id,
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