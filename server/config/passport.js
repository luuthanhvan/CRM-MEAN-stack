const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');

const localLogin = new LocalStrategy(
    async (username, password, done) => {
        let user = await User.findOne({ username: username });

        if(!user){
            return done(null, false, { message : 'Account does not exist!'});
        }

        if(password != user.password){
            return done(null, false, { message : 'Password incorrect!'});
        }

        done(null, user);
    }
);

passport.use(localLogin);

module.exports = passport;