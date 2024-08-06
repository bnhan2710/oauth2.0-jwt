const FacebookStaregy = require('passport-facebook').Strategy;
const passport = require('passport');
const User = require('../models/User');
require('dotenv').config();

passport.use(new FacebookStaregy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/facebook/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
      const email = profile.emails[0].value;
        const ExitsUser = await User.findOne({ email: email });
        if(ExitsUser){
            return done(null, ExitsUser);
        }else{
            const newUser = await new User({
                username: profile.displayName,
                email: email,
                googleId: profile.id,

            });
            await newUser.save();
            return done(null, newUser);
        }
  }
));

passport.serializeUser((user, done) => {
      done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
    


module.exports = passport;