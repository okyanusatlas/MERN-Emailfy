const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
    const user = await User.findById(userId);
    done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const existingUser = await User.findOne({googleId: profile.id});
            done(null, existingUser);
            if (!existingUser) {

                const user = await new User({googleId: profile.id}).save();
                done(null, user);
            }
        } catch (err) {
            console.error(err);
        }


    })
);