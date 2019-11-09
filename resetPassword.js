const db = require('./database/db');

module.exports = app => {
    app.get('/reset', (req, res, next) => {
        db.query("SELECT * FROM users WHERE resetPasswordToken = ?", [req.query.resetPasswordToken], function(error, result) {
            if(!result[0]) {
                console.log('password reset link is invalid or has expired');
                res.json('password reset link is invalid or has expired');
            } else {
                res.status(200).send({
                    userName: result[0].userName,
                    message: 'password reset link a-ok',
                    password: result[0].password
                });
            }
        });
    });
};