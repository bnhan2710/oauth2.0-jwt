const User = require('../models/User');
const bcrypt = require('bcrypt');

const authControllers = {
    // REGISTER
    registersUser: async (req, res) => {
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

    // LOGIN
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(404).json("Not found username!");
            }

            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(400).json("Wrong password!");
            }

            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }
};

module.exports = authControllers;
