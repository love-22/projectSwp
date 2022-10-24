if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const session = require('express-session');
//const path = require('path');
const bcrypt = require('bcrypt'); 
const flash = require('express-flash');
const sqlite3 = require('sqlite3').verbose();

// Passport INIT
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let sql;

// Connect to DB.
const db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err)=>{
  if (err) return console.error(err.message);
});

//Database (please do not when you productions....)
const users = [];

//view engine setup
app.set('view-engine', 'ejs');

//flash messages
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const userLogIn = "SELECT id, email, password FROM users WHERE email = $1;";
const findUserbyID = "SELECT id FROM users WHERE id = $1;";

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

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("I am inside checkauth isAuth");
    return res.redirect('/');
  }
  next();
}

//Api middelwares
app.use(express.urlencoded({ extended: false })); //this is to accept data in urlencoded format

//main page
app.get('/', (req, res) => {
    res.render('index.ejs' )
});

//login page1
app.get('/login1', checkAuthenticated, (req, res) => {
  res.render('login1.ejs');
});

// app.post('/login1', passport.authenticate('local', {
//   successRedirect: '/login2', //if login is successful
//   failureRedirect: '/login1', //if login is not successful
//   failureFlash: true
// }));


app.post('/login1', checkAuthenticated, function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
      if (err) {
          console.log(err);
          return next(err);
      }
      if (!user) {
          console.log(info);
          console.log("Access Denied");
          return res.redirect('/login1');
      }
      req.logIn(user, function (err) {
          if (err) {
              console.log(err);
              return next(err);
          }
          console.log("Access Granted");
          return res.redirect('/login2');
      });
  })(req, res, next);
});


//login page2 
app.get('/login2', (req, res) => {
  res.render('login2.ejs');
});

app.post('/login2',passport.authenticate('local', {
  successRedirect: '/', //if login is successful
}));

//register page
app.get('/join', (req, res) => {
  res.render('join.ejs');
});

app.post('/join', async (req, res) => {
  try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10); //hashing password

    sql = `INSERT INTO users(name, email, password) VALUES (?, ?, ?)`;
    db.run(sql, [req.body.name, req.body.email, hashedPassword], (err)=>{
        if (err) return console.error(err.message);
    })
    res.redirect('/login1');
  }catch{
    res.redirect('/join');
  }
  console.log(users);
});

//orderDetails page
app.get('/orderDetails', (req, res) => {
  res.render('orderDetails.ejs');
});

//productDetails page
app.get('/productDetails', (req, res) => {
  res.render('productDetails.ejs');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
