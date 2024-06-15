const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const passwordControllers = {
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
