const db = require('./database/db');
const crypto  = require('crypto');
require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = app => {
    app.post('/forgotPassword', (req, res, next) => {
        if(req.body.email === '') {
            res.json('email required');
        }
        console.log(req.body.email);
        db.query('SELECT * from users WHERE email = ?', [req.body.email], function(error, result) {
            if(!result[0]) {
                console.log('email not in database');
                res.json('email not in db');
            } else {
                const token = crypto.randomBytes(20).toString('hex');
                console.log(token);
                db.query('UPDATE users SET resetPasswordToken = ? WHERE id = ?', [token, result[0].id]);

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: `${process.env.EMAIL_ADDRESS}`,
                        pass: `${process.env.EMAIL_PASSWORD}`,
                    }
                });

                const mailOption = {
                    from: 'purchaseadda519@gmail.com',
                    to: `${result[0].email}`,
                    subject: 'Link to Reset Password',
                    text: `You are recieving this because you (or someone else) have requested the reset of the password for your account.\n\n` + 
                            `Please click on the following link or paste this onto your browser to complete the process within one hour of recieving it:\n\n` + 
                            `http://localhost:3000/reset/${token} \n\n` + 
                            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };

                console.log('sending mail');

                transporter.sendMail(mailOption, function(err, response) {
                    if(err) {
                        console.error('there was an error: ', err)
                    } else {
                        console.log('here is th res: ', response);
                        res.status(200).json('recovery email sent');
                    }
                });
            }
        });
    });
};