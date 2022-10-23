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

let sql;

// Connect to DB.
const db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err)=>{
  if (err) return console.error(err.message);
});

//passport initialization
const passport = require('passport');
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

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


//Api middelwares
app.use(express.urlencoded({ extended: false })); //this is to accept data in urlencoded format

//main page
app.get('/', (req, res) => {
    res.render('index.ejs' )
});

//login page1
app.get('/login1', (req, res) => {
  res.render('login1.ejs');
});

app.post('/login1', passport.authenticate('local', {
  successRedirect: '/login2', //if login is successful
  failureRedirect: '/login1', //if login is not successful
  failureFlash: true
}));

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

    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
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
