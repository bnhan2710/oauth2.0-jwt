const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const mailService = require('../Services/mail.service');
require('dotenv').config();

let refreshTokens = [];

const authControllers = {
    // REGISTER
    registerUser: async (req, res) => {
        try {
            const existingUser = await User.findOne({ username: req.body.username });
            if (existingUser) {
                return res.status(400).json("Username already exists!");
            }

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Create new user
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            const user = await newUser.save();
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err.message);
        }
    },

    // GENERATE ACCESS TOKEN
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "45s" }
        );
    },

    // GENERATE REFRESH TOKEN
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "365d" }
        );
    },

    // LOGIN
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(404).json("Username not found!");
            }

            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(400).json("Incorrect password!");
            }

            if (user && validPassword) {
                const accessToken = authControllers.generateAccessToken(user);
                const refreshToken = authControllers.generateRefreshToken(user);
                refreshTokens.push(refreshToken);

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });

                const { password, ...other } = user._doc;
                res.status(200).json({ ...other, accessToken });
            }
        } catch (err) {
            res.status(500).json(err.message);
        }
    },

    // REQUEST REFRESH TOKEN
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json("You are not authenticated!");
        }
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Refresh token is not valid!");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid!");
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

            // Create new access token and refresh token
            const newAccessToken = authControllers.generateAccessToken(user);
            const newRefreshToken = authControllers.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            res.status(200).json({ accessToken: newAccessToken });
        });
    },

    // LOG OUT
    userLogout: async (req, res) => {
        try {
            res.clearCookie("refreshToken");
            refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
            res.status(200).json("Logged out successfully");
        } catch (err) {
            res.status(500).json(err.message);
        }
    },

    // FORGOT PASSWORD
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
            user.resetPasswordExpires = Date.now() + 3600000;
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
                      `http://${req.headers.host}/v1/auth/reset/${token}\n\n` +
                      `If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };

            await transporter.sendMail(mailOptions);
            res.status(200).json({ msg: 'Password reset email sent!' });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    // RESET PASSWORD
    resetPassword: async (req, res) => {
        const { newPassword, confirmPassword } = req.body;
        const token = req.params.token;

        if (!token || !newPassword || !confirmPassword) {
            return res.status(400).json({ msg: "Please fill in all fields!" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ msg: "Passwords do not match!" });
        }

        try {
            const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
            if (!user) {
                return res.status(400).json({ msg: 'Password reset token is invalid or has expired.' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(newPassword, salt);

            user.password = hashed;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();
            res.status(200).json({ msg: 'Password changed successfully!' });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
};

module.exports = authControllers;
