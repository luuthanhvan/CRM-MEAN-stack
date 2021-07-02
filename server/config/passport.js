const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');

const localLogin = new LocalStrategy(
    async (username, password, done) => {
        User
            .findOne({ username: username })
            .then((user) => {
                if (!user)
                    return done(null, false, { message: 'Account does not exist' });
                // wrong password
                else if (user.password != password)
                    return done(null, false, { message: 'Wrong password' });
                // authentication succeeded
                else
                    return done(null, user);
            });
    }
);

passport.use(localLogin);

module.exports = passport;