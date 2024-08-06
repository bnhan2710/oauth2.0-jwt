var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/User');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
      const email = profile.emails[0].value;
        const ExitsUser = await User.findOne({ email: email });
        if(ExitsUser){
            return cb(null, ExitsUser);
        }else{
            const newUser = await new User({
                username: profile.displayName,
                email: email,
                googleId: profile.id,

            });
            await newUser.save();
            return cb(null, newUser);
        }
  }
));

passport.serializeUser((user, done) => {
    console.log('SerializeUser', user.id);
    done(null, user.id);
  });

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        console.log('DeserializeUser', user);
      done(err, user);
    });
  });

module.exports = passport;