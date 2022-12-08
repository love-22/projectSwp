const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {db} = require('./database');
const {userLogIn, findUserbyID} = require('./database');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
  function (email, password, done) {
    const query = db.prepare(userLogIn);
    query.get(email, async function (err, row) {
      if (err) { return done(err); }
      if (!row) { return done(null, false, { message: 'User not found.' }); }
      if (await bcrypt.compare(password, row.password)) {
        done(null, { id: row.id });
        console.log(row);
      }
      else {
        return done(null, false, { message: 'Incorrect password' });
      }
    });
  }
));

passport.serializeUser(function (user, done) {
  console.log("In serialize");
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log("In deserialize");
  const query = db.prepare(findUserbyID);
  query.get(id, function (err, row) {
    done(err, row);
  });
});

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      console.log("I am inside checkauth isAuth");
      return res.redirect('/');
    }
    next();
  }

module.exports = {
    passport,
    checkAuthenticated
};