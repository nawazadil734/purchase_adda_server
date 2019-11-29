const db = require('./database/db');
const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
    app.put('/updatePasswordViaEmail', (req, res, next) => {
        const {userName, password} = req.body;
        db.query("SELECT * FROM users WHERE userName = ?", [userName], function(error, result) {
            if(result[0]) {
                var generateHash = function(password) {
                    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                };
                const hashedPassword = generateHash(password);
                db.query('UPDATE users SET resetPasswordToken = ? WHERE id = ?', [null, result[0].id], function(err, results) {
                    db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, result[0].id], function(errors, reults) {
                        // alert("Password Updated")
                        res.status(200).send({ message: "password updated"});
                        // res.redirect("http://localhost:3000/")
                    });
                });
            } else {
                res.status(404).json('no user exists in db to update');
            }
        });
    });
};