const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {db, findAllbyID, findUserToLogAttempt, updateUserAttempt, userLogIn, findUserbyID, updateUserlocked, findLockStatus, updateLockStatus} = require('./database');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
  function (email, password, done) {
    const query = db.prepare(userLogIn);
    query.get(email, async function (err, row) {
      if (err) { return done(err); }
      if (!row) { return done(null, false, { message: 'Incorrect Password or Email' }); }
      if (await bcrypt.compare(password, row.password)) {
        const query2 = db.prepare(findUserToLogAttempt);
        query2.get(email, async function (err, rows) {
          if(parseInt(rows.locked) < parseInt(Date.now())) {
            console.log("No longer locked user.")
            db.run(updateUserAttempt, ['0', email], (err) => {
              if (err) return console.error(err.message);
            });
            db.run(updateUserlocked, ['0', email], (err) => {
              if (err) return console.error(err.message);
            });
            done(null, { id: row.id });
            console.log(row);
          } else {
            return done(null, false, { message: 'Account locked due to excessive tries.'});
          }
        })
        
      }
      else {
        const query2 = db.prepare(findUserToLogAttempt);
        query2.get(email, async function (err, row) {
          if (parseInt(row.attempt) != 3){
            let tempAttempt = parseInt(row.attempt);
            tempAttempt++;
            db.run(updateUserAttempt, [tempAttempt, email], (err) => {
              if (err) return console.error(err.message);
            });

            if (tempAttempt == 3) {
              db.run(updateUserlocked, [Date.now() + 300000, email], (err) => {
                if (err) return console.error(err.message);
              });
            }
            return done(null, false, { message: 'Incorrect Password or Email' });
          }
          console.log(Date.now());
          console.log(Date.now() + 300000);
          const query2 = db.prepare(findUserToLogAttempt);
          query2.get(email, async function (err, rows) {
            if(parseInt(rows.locked) < parseInt(Date.now())) {
              console.log("No longer locked user.")
              db.run(updateUserAttempt, ['0', email], (err) => {
                if (err) return console.error(err.message);
              });
              db.run(updateUserlocked, ['0', email], (err) => {
                if (err) return console.error(err.message);
              });
              done(null, { id: row.id });
              console.log(row);
            } else {
              return done(null, false, { message: 'Account locked due to excessive tries.'});
            }
          })
        });
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
};

const checkAuthenticated2FA = (req, res, next) => {
  let alerts = [];
  if (req.isAuthenticated()) {
    next();
  } else {
    alerts.push("Please login to continue.");
    res.render('login1.ejs', {
      length:alerts.length,
      alert:alerts
    });
  }
};

const checkIfFullyLoggedIn = (req, res, next) => {
  let alerts = [];
  
  if (!req.isAuthenticated()) {
    console.log("I am inside checkauth isAuth");
    alerts.push("Please login to continue.");
    res.render('login1.ejs', {
      length:alerts.length,
      alert:alerts
    });
  } else {
    const query = db.prepare(findLockStatus);
    query.get(req.user.id, function (err, row) {
      if (row.lockStatus == 'Locked') {
        console.log("Locked");
        alerts.push("Enter 2FA to continue.");
        res.render('login2.ejs', {
          length:alerts.length,
          alert:alerts
        });
      } else {
        next();
      }
  });
  }
};


const checkIfAdmin = (req, res, next) => {  
  const query = db.prepare(findAllbyID);
  query.get(req.user.id, function (err, row) {
    console.log();
    if (row.role == 'Admin') {
      console.log("IsAdmin");
      next();
    } else {
      return res.redirect('/userDashboard');
    }
  });
};

module.exports = {
    passport,
    checkAuthenticated,
    checkIfAdmin,
    checkIfFullyLoggedIn,
    checkAuthenticated2FA
};