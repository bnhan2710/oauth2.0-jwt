const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
require('dotenv').config();
const passport = require('passport');
const router = require('express').Router();
require('../passport/googleStrategy');
const cookieSession = require('cookie-session')
router.use(cookieSession({
    keys: [process.env.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 1000}));

router.use(passport.initialize());
router.use(passport.session());
router.get('/google',passport.authenticate('google', { scope: ['profile' , 'email']  }));
  
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user) => {
        req.user = user;
        next()
    })(req, res, next);
},(req,res) => {
    res.status(200).json(req.user);
});

module.exports = router;