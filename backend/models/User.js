const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 10,
        unique: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 1024,
        minlength: 6
    },
    admin: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, 
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
