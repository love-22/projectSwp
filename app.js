if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { getMain, postLogout, goToProductOnClick } = require('./routes/index');
const { getUserDashboard, userDeletesAccount } = require('./routes/userDashboard');
const { getUserDashboardEdit, postUserDashboardEdit } = require('./routes/userDashboardEdit');
const { passport, checkAuthenticated, checkIfAdmin, checkIfFullyLoggedIn, checkAuthenticated2FA } = require('./passport-config');
const { getLogin, postLogin, getLogin2FA, postLogin2FA } = require('./routes/login');
const { getRegister, postRegister } = require('./routes/register');
const { getAdminDashboard } = require('./routes/adminDashboard');
const { getProductDetails, addToCart } = require('./routes/productDetails');
const { getWriteReview, postWriteReview } = require('./routes/writeReview');
const { getCart, removeProduct, payCart } = require('./routes/cart');
const { db } = require('./database');
const express = require('express');
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const { getProductUpload, postProductUpload } = require('./routes/productUpload');
app.set('view-engine', 'ejs');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');

const urlencodedParser = bodyParser.urlencoded({extended:false});

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

const multer = require("multer");
const path = require("path");
const { getProductEdit, postProductEdit } = require('./routes/productEdit');
const { getOrderedItems } = require('./routes/orders');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/img')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({storage:storage});

///////////////////////////////////////////////////////////////
// Index
///////////////////////////////////////////////////////////////

app.get('/', getMain);

app.post('/main', checkIfFullyLoggedIn, postLogout);

app.post('/goToProduct', goToProductOnClick);

///////////////////////////////////////////////////////////////
// Login
///////////////////////////////////////////////////////////////

app.get('/login1', checkAuthenticated, getLogin);

app.post('/login1', checkAuthenticated, urlencodedParser, [
  check('password', "PASSWORD must be at least 8 characters long.")
    .exists()
    .isLength({ min:8, max:256}),
  check('email', "EMAIL is not valid")
    .isEmail()
    .normalizeEmail()
], postLogin);

app.get('/login2', checkAuthenticated2FA, getLogin2FA);

app.post('/login2', checkAuthenticated2FA, urlencodedParser, [
  check('token', "Token must be a six digit number")
    .exists()
    .isLength({min:6, max:6})
    .isNumeric()
], postLogin2FA);

///////////////////////////////////////////////////////////////
// Registration
///////////////////////////////////////////////////////////////

app.get('/join', getRegister);

app.post('/join', urlencodedParser, [
  check('name', "Name must be at least")
    .exists()
    .isLength({min:3, max:128}),
  check('email', "EMAIL is not valid")
    .isEmail()
    .normalizeEmail(),
  check('password', "PASSWORD must be at least 8 characters long.")
    .exists()
    .isLength({ min:8, max:256}),
  check('repassword', "RE-PASSWORD must be at least 8 characters long.")
    .exists()
    .isLength({ min:8, max:256})
], postRegister);

///////////////////////////////////////////////////////////////
// User Dashboard
///////////////////////////////////////////////////////////////

app.get('/userDashboard', checkIfFullyLoggedIn, getUserDashboard);

app.post('/deleteAccount', checkIfFullyLoggedIn, userDeletesAccount);

app.get('/userDashboardEdit', checkIfFullyLoggedIn, getUserDashboardEdit);

app.post('/userDashboardEdit', checkIfFullyLoggedIn, urlencodedParser, [
  check('name', "Name must be at least")
    .exists()
    .isLength({min:3, max:128}),
  check('email', "EMAIL is not valid")
      .isEmail()
      .normalizeEmail(),
  check('phone', "Phone must be between 2 and 20 digits.")
    .exists()
    .isLength({min:2, max:20})
    .isNumeric(),
  check('address', "Name must not exceed 500 characters.")
    .exists()
    .isLength({min:3, max:500}),
  check('password', "PASSWORD must be at least 8 characters long.")
    .exists()
    .isLength({ min:8, max:256}),
  check('repassword', "NEW PASSWORD must be at least 8 characters long.")
    .isLength({ min:0, max:256}),
  check('repassword2', "NEW RE-PASSWORD must be at least 8 characters long.")
    .isLength({ min:0, max:256})
],postUserDashboardEdit);

app.get('/getOrders', checkIfFullyLoggedIn, getOrderedItems);

///////////////////////////////////////////////////////////////
// Admin Dashboard
///////////////////////////////////////////////////////////////

app.get('/adminDashboard', checkIfFullyLoggedIn, checkIfAdmin, getAdminDashboard);

app.get('/productUpload', checkIfFullyLoggedIn, checkIfAdmin, getProductUpload);

app.get('/productEdit', checkIfFullyLoggedIn, checkIfAdmin, getProductEdit);

app.post('/removeProductFromWebsite', checkIfFullyLoggedIn, checkIfAdmin, postProductEdit);

app.post('/productUpload', checkIfFullyLoggedIn, checkIfAdmin, upload.single('picture'), postProductUpload);

///////////////////////////////////////////////////////////////
// Product Details
///////////////////////////////////////////////////////////////

app.get('/productDetails/:id', getProductDetails);

app.get('/writeReview/:id', checkIfFullyLoggedIn, getWriteReview);

app.get('/cart', checkIfFullyLoggedIn, getCart);

app.post('/addToCart', checkIfFullyLoggedIn, addToCart);

app.post('/removeProduct', checkIfFullyLoggedIn, removeProduct);

app.post('/writeReview/:id', checkIfFullyLoggedIn, urlencodedParser, [
  check('userReview', "Review cannot be empty or exceed 5000 characters.")
    .exists()
    .isLength({min:2, max:5000})
], postWriteReview);

app.post('/payCart', checkIfFullyLoggedIn, payCart);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// module.exports = {
//   validationResult
// };