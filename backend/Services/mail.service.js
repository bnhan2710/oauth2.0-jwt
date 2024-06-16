const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const mailService = {
    sendMail: async (email, subject, text) => {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: subject,
                text: text
            };

            await transporter.sendMail(mailOptions);
        } catch (err) {
            console.log(err);
        }
    }
}