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

app.get('/getOrders', getOrderedItems);

///////////////////////////////////////////////////////////////
// Admin Dashboard
///////////////////////////////////////////////////////////////

app.get('/adminDashboard', getAdminDashboard);

app.get('/productUpload', getProductUpload);

app.get('/productEdit', getProductEdit);

app.post('/removeProductFromWebsite', postProductEdit);

app.post('/productUpload', upload.single('picture'), postProductUpload);

///////////////////////////////////////////////////////////////
// Product Details
///////////////////////////////////////////////////////////////

app.get('/productDetails/:id', getProductDetails);

app.get('/writeReview/:id', getWriteReview);

app.get('/cart', getCart);

app.post('/addToCart', addToCart);

app.post('/removeProduct', removeProduct);

app.post('/writeReview/:id', postWriteReview);

app.post('/payCart', payCart);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});