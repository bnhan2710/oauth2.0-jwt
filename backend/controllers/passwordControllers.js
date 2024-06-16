const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const passwordControllers = {
    // Forgot Password
    forgotPassword: async (req, res) => {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ msg: 'Please provide an email address!' });
        }

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ msg: 'User not found!' });
            }

            const token = crypto.randomBytes(20).toString('hex');

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            await user.save();

            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            const mailOptions = {
                to: user.email,
                from: process.env.EMAIL,
                subject: 'Password Reset',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                      `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
                      `http://${req.headers.host}/reset/${token}\n\n` +
                      `If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({ msg: 'Password reset email sent!' });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    //RESET PASSWORD
    resetPassword: async (req, res) => {
        const { newPassword, confirmPassword } = req.body;
        const token = req.header('x-auth-token');

        if (!token || !newPassword || !confirmPassword) {
            return res.status(400).json({ msg: "Please fill in all fields!" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ msg: "Password does not match!" });
        }

        jwt.verify(token, process.env.JWT_ACCESS_KEY, async (err, decoded) => {
            if (err) {
                return res.status(400).json({ msg: 'Token is not valid!' });
            }

            try {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(newPassword, salt);
                const user = await User.findById(decoded.id);
                if (!user) {
                    return res.status(404).json({ msg: 'User not found!' });
                }
                user.password = hashed;
                await user.save();
                return res.status(200).json({ msg: 'Password changed successfully!' });
            } catch (err) {
                return res.status(500).json({ msg: err.message });
            }
        });
    }
}

module.exports = passwordControllers;
