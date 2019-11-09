const db = require('../database/db');
const bCrypt = require('bcrypt-nodejs');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUserSignUp(user) {
    const timestamp = new Date().getTime();
    // console.log("checking", user.id);
    return jwt.encode({ iat: timestamp, sub: user.id }, config.secret);
};

function tokenForUserSignIn(user) {
    const timestamp = new Date().getTime();
    // console.log("checking", user[0].id);
    return jwt.encode({ iat: timestamp, sub: user[0].id }, config.secret);
};

exports.signin = function(req, res, next) {
    // User has already had their email and password auth'd
    // We just need to give them a token
    res.send({ token:  tokenForUserSignIn(req.user)});
};

exports.signup = function(req, res, next) {
    const { 
        firstName, 
        lastName, 
        phoneNumber, 
        userName, 
        city,
        state,
        streetNo,
        email,
        password
    } = req.body;
    // See if a suer with the given email exists
    
    db.query("SELECT * FROM users WHERE email = ?", [email], function(error, results, fields) {
        if(error) { return next(error);}
        // If a user with email does exists, return an error
        if(results.length) {
            return res.status(422).send({ error: 'Email is in use'});
        }

        // If a user with emial does not exists , create
        // and save user records

        var newUserMysql = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            userName: userName,
            streetNo : streetNo,
            city : city,
            state : state,
            userImage: '',
            password: password
        };

        var generateHash = function(password) {
            return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };

        const hashedPassword = generateHash(password);
        newUserMysql.password = hashedPassword;
        db.query("INSERT INTO users SET ?" , newUserMysql, function(error, results) {
            if(error) { return next(error);}
            // console.log(results.insertId); 
            db.query("SELECT * FROM users WHERE id = ?", [results.insertId], function(err, result) {
                if(err) { return next(err);}
                var userSave = {
                    email: result[0].email,
                    firstName: result[0].firstName,
                    lastName: result[0].lastName,
                    phoneNumber: result[0].phoneNumber,
                    userName: result[0].userName,
                    streetNo: result[0].streetNo,
                    city : result[0].city,
                    state : result[0].state,
                    userImage: '',
                    password: result[0].password,
                    id: result[0].id
                };
                return res.status(200).send({ token: tokenForUserSignUp(userSave)});
            })   
        });        
        // Respond to that request indicating user was created    
        });

};