const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const mailService = {
    sendMail: async (email,req,token) => {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });

            const mailOptions = {
                to: email,
                from: process.env.EMAIL,
                subject: 'Password Reset',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                      `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
                      `http://${req.headers.host}/v1/auth/reset/${token}\n\n` +
                      `If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };

            await transporter.sendMail(mailOptions);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = mailService;