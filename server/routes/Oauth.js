const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
require('dotenv').config();
const passport = require('passport');
const router = require('express').Router();
require('../passport/googleStrategy');
require('../passport/facebookStategy');

router.get('/google',passport.authenticate('google', { scope: ['profile' , 'email']  }));
  
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('http://localhost:8000');
  });

router.get('/facebook',passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('http://localhost:8000');
  });

module.exports = router;