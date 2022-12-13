if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { getMain, postLogout, goToProductOnClick } = require('./routes/index');
const { getUserDashboard, userDeletesAccount } = require('./routes/userDashboard');
const { getUserDashboardEdit, postUserDashboardEdit } = require('./routes/userDashboardEdit');
const { passport, checkAuthenticated } = require('./passport-config');
const { getLogin, postLogin, getLogin2FA, postLogin2FA } = require('./routes/login');
const { getRegister, postRegister } = require('./routes/register');
const { getAdminDashboard } = require('./routes/adminDashboard');
const { getProductDetails } = require('./routes/productDetails');
const { getWriteReview, postWriteReview } = require('./routes/writeReview')
const { db } = require('./database');
const express = require('express');
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');
const flash = require('express-flash');

app.set('view-engine', 'ejs');
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

let sql;
const products = [];

app.use(express.urlencoded({ extended: false })); //this is to accept data in urlencoded format

///////////////////////////////////////////////////////////////
// Index
///////////////////////////////////////////////////////////////

app.get('/', getMain);

app.post('/main', postLogout);

app.post('/goToProduct', goToProductOnClick);

///////////////////////////////////////////////////////////////
// Login
///////////////////////////////////////////////////////////////

app.get('/login1', checkAuthenticated, getLogin);

app.post('/login1', checkAuthenticated, postLogin);

app.get('/login2', getLogin2FA);

app.post('/login2', postLogin2FA);

///////////////////////////////////////////////////////////////
// Registration
///////////////////////////////////////////////////////////////

app.get('/join', getRegister);

app.post('/join', postRegister);

///////////////////////////////////////////////////////////////
// User Dashboard
///////////////////////////////////////////////////////////////

app.get('/userDashboard', getUserDashboard);

app.post('/deleteAccount', userDeletesAccount);

app.get('/userDashboardEdit', getUserDashboardEdit);

app.post('/userDashboardEdit', postUserDashboardEdit);

///////////////////////////////////////////////////////////////
// Admin Dashboard
///////////////////////////////////////////////////////////////

app.get('/adminDashboard', getAdminDashboard);

///////////////////////////////////////////////////////////////
// Product Details
///////////////////////////////////////////////////////////////

app.get('/productDetails/:id', getProductDetails);

app.get('/writeReview/:id', getWriteReview);

app.post('/writeReview/:id', postWriteReview);

app.get('/orderDetails', (req, res) => {
  res.render('orderDetails.ejs');
});

app.get('/productUpload', (req, res) => {
  res.render('productUpload.ejs');
});

app.post('/productUpload', async (req, res) => {
  try {
    sql = `INSERT INTO products(productName, price, description, uploadImage) VALUES (?, ?, ?, ?)`;
    db.run(sql, [req.body.productName, req.body.price, req.body.description, req.body.uploadImage], (err) => {
      if (err) return console.error(err.message);
    })
    res.redirect('/productDetails');
  } catch {
    res.redirect('/productUpload');
  }
  console.log(products, "Update Products... :D");
});

app.get('/test', (req, res) => {
  res.render('test.ejs');
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});