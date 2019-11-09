const passport = require('passport');
const db = require('../database/db');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt-nodejs');
// Create local strategy
const localOptions = { usernameField: 'email' };
const LocalLogin = new LocalStrategy(localOptions , function(email, password, done) {
    // Verify this email and password, call done with the user
    // if it is the correct email and password
    // otherwise, call done with false
    db.query("SELECT * FROM users WHERE email = ?", [email], function(err, user) {
        console.log("sfdsfsdfsd", user)
        if (err) { return done(err); }
        // console.log("signin checking" ,user === false)
        if(!user.length) { return done(null, false); }
        // console.log("passport pasge user sign", user[0].password);
        // console.log("user password", user.password);
        // compare passwords - is `password` equal to user.password?
        bcrypt.compare(password, user[0].password, function(err, isMatch) {
            if(err) { return done(err); }
            if(!isMatch) {
                return done(null, false);
            }
            return done(null, user);
        });
    });
});

// Setup options for JWT Strategy 
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT strategy

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    // See if the user ID in the payload exists in our database
    // If it does, call 'done' with that other
    // otherwise, call done without a user object

    db.query("SELECT * FROM users where id = ?", [payload.sub], function(err, user) {
        if (err) { return done(err, false);}

        if(user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});
// Tell passport to use this strategy

passport.use(jwtLogin);
passport.use(LocalLogin);


