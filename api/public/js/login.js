

function fetchSecurityQuestions(dropdown) {
    // Make an AJAX request to fetch all security questions
    $.ajax({
        type: 'GET',
        url: '/api/questions',
        contentType: 'application/x-www-form-encoded',
        success: function (responseData, textStatus, jqXHR) {
            const questions_data = responseData.data;
            console.log(questions_data);

            let questions = {};
            questions_data.forEach(ques => {
                questions[ques.id] = ques.content;
            });

            populateSecurityQuestions(dropdown, questions);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);

            populateSecurityQuestions(dropdown, {});
        }
    });
}

function populateSecurityQuestions(dropdown, questions) {
    var $questionDropdown = $(dropdown);
    for (let id in questions) {
        let content = questions[id];
        $questionDropdown.append("<option value='" + id + "'> " + content + "</option > ");
    }
}

function comparePasswords(passwordDiv, confirmPasswordDiv) {
    let password = document.querySelector(passwordDiv),
        confirmPassword = document.querySelector(confirmPasswordDiv);

    function validatePassword() {
        if (password.value != confirm_password.value) {
            confirmPassword.setCustomValidity("Passwords Don't Match");
        } else {
            confirmPassword.setCustomValidity('');
        }
    }

    password.onchange = validatePassword;
    confirmPassword.onchange = validatePassword;
}

function validatePassword(passwordDiv) {
    let password = document.querySelector(passwordDiv);

    function validatePassword () {
        let len = password.value.length;
        if (len < 8 || len > 13) {
            password.setCustomValidity("Password should be 8-13 characters long");
        } else {
            password.setCustomValidity('');
        }
    }

    password.onchange = validatePassword;
}