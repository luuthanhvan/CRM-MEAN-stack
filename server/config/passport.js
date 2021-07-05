const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');

const localLogin = new LocalStrategy(
    async (username, password, done) => {
        let user = await User.findOne({ username: username });

        if(!user || password != user.password)
            return done(null, false, { message : 'Your login details could not be verified. Please try again.'})

        done(null, user);
    }
);

passport.use(localLogin);

module.exports = passport;