const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/User");

const localLogin = new LocalStrategy(async (username, password, done) => {
  let user = await User.findOne({ username: username });

  if (!user) {
    return done(null, false, { message: "Username incorrect" });
  }

  if (password != user.password) {
    return done(null, false, { message: "Password incorrect!" });
  }

  if (!user.isActive) {
    return done(null, false, { message: "Account has been disabled" });
  }

  done(null, user);
});

passport.use(localLogin);

module.exports = passport;
