const jwt = require('jsonwebtoken');

// Table Information

// Tokens, Secrets and configurations
const jwtSecret = process.env.JWTSECRET || '**YouWillNeverGuess**';
const jwtExpiry = 6 * 60 * 60; // expires in 6 hrs
const IP = process.env.IP || '127.0.0.1';
const PORT = process.env.PORT || 5380;
const dbName = process.env.DBNAME || 'gameDB';
const ML_secret = process.env.ML || 'Dummy_Secret';
const admin_secret = process.env.ADMIN_SECRET || 'You have not exported a secret';


// Regex for input validation
const EmailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const nameRegex = /[ !@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]/; // Allowed: _-
const textRegex = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]/; // Allowed: _-s
// const passwordRegex = /[ !^&()_+\-=\[\]{};':"\\|,.<>\/?]/; // Allowed: @#$%*
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,13}$/;
const adminSecretRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;


const alphaNumericRegex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/; // Allowed: nothing
const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
// const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
// Export Object
module.exports = {
    'jwtSecret': jwtSecret,
    'jwtExpiry': jwtExpiry,
    'port': PORT,
    'IP': IP,
    'dbName': dbName,
    'ML_secret': ML_secret,
    'admin_secret': admin_secret,
    'emailRegex': EmailRegex,
    'nameRegex': nameRegex,
    'textRegex': textRegex,
    'passwordRegex': passwordRegex,
    'adminSecretRegex': adminSecretRegex,
    'alphaNumericRegex': alphaNumericRegex,
    'urlRegex': urlRegex
}