const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
            res.status(500).json(err);
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
            res.status(500).json(err);
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
};

module.exports = authControllers;
