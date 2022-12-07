if (process.env.NODE_ENV !== 'production') {
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
const db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) return console.error(err.message);
});

//Database
const users = [];
const products = [];
const tokens = {}; // { email: token }
//view engine setup
app.set('view-engine', 'ejs');

//flash messages
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  // cookie: {
  //   expires: 60000
  // }
}));

//public folder
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

const userLogIn = "SELECT id, email, password FROM users WHERE email = $1;";
const findUserbyID = "SELECT id FROM users WHERE id = $1;";
const findAllbyID = "SELECT name, email, phone, address, role FROM users WHERE id = $1;";
const findAllCustomers = "SELECT id, name, email, phone, address, role FROM users WHERE role = $1;";
const findAllProducts = "SELECT id, productName, productPrice, productDesc, productImg, ProductCreationDate FROM product";
const findProductById = "SELECT productName, productPrice, productDesc, productImg, ProductCreationDate FROM product WHERE id = $1";

// Not needed. Remove later.
//const amountOfCustomers = "SELECT id, name, email, phone, address, role FROM users WHERE role = $1;";

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

//Main page
app.get('/', (req, res) => {
  const query = db.prepare(findAllProducts);
  query.all(function (err, rows) {
        let tempPrice = 0;
        let x = 0;
        let id = [];
        let productName = [];
        let productPrice = [];
        let productDesc = [];
        let productImg = [];
        let ProductCreationDate = [];
        while(x!=rows.length) {
          tempPrice = "€" + rows[x].productPrice/100;
          id.push(rows[x].id);
          productName.push(rows[x].productName);
          productPrice.push(tempPrice);
          productDesc.push(rows[x].productDesc);
          productImg.push(rows[x].productImg);
          ProductCreationDate.push(rows[x].ProductCreationDate);
          x++;
        }
        res.render('index.ejs', {id:id,
                                 name:productName,
                                 desc:productDesc,
                                 price:productPrice,
                                 img:productImg,
                                 length:rows.length})
  });
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
  const email = req.body.email
  passport.authenticate('local', function (err, user, info, attempt) {
    if (err) {
      console.log(err);
      return next(err);
    }
    if (!user) {
      console.log(info);
      console.log("Access Denied");
      return res.redirect('/login1');
    }

     //if users password is wrong 3 times then lock the account for 5 minutes 
    if (attempt >= 3) {
      console.log("Too many attempts");
      userLogIn = 1;
      setTimeout(function () {
        userLogIn = 0;
      }, 300000);
      return res.redirect('/login1');
    } 
    
    req.logIn(user, function (err) {
      if (err) {
        console.log(err);
        return next(err);
      }
   

      const nodemailer = require("nodemailer");
      async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing

        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 587, //SMTP transport security port //if not working try 2525.. 
          auth: {
            user: "e9702670857b2c",
            pass: "2e6f61e062e02a"
          }
        });
       
        //token random 6 digits code
        const token = Math.floor(100000 + Math.random() * 900000);

        tokens [Number] = token;
        // tokens[email] = token;

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: 'test@swp.com', // Sender
          to: email, // Receivers
          subject: "[Test] SWP Login Token", // Mail Subject

          //Random 6 digit code email format
          text: "Your Login code is: " + token, // plain text body
          html: "Your Login code is: " + token // html body
        });

        // Message sent
        console.log("Token sent");
        console.log("Users: ", users);

      }

      main().catch(console.error);

      console.log("Access Granted");
      return res.redirect('/login2');
    });
  })(req, res, next);
});


//login page2 
app.get('/login2', (req, res) => {
  res.render('login2.ejs');
});


/* app.post('/login2', passport.authenticate('local', {
successRedirect: '/',
failureRedirect: '/login2',
failureFlash: true
})); */

app.post('/login2', function (req, res, next) {
  //const email = req.body.email
  const token = req.body.token
  //if (tokens[email] == token) {
    if (tokens[Number] == token) {
    console.log("Access Granted");
    return res.redirect('/');
  }
  else {
    console.log("Access Denied");
    return res.redirect('/login2');
  }
})

//register page
app.get('/join', (req, res) => {
  res.render('join.ejs');
});

app.post('/join', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); //hashing password

    sql = `INSERT INTO users(name, email, password) VALUES (?, ?, ?)`;
    db.run(sql, [req.body.name, req.body.email, hashedPassword], (err) => {
      if (err) return console.error(err.message);
    })
    res.redirect('/login1');
  } catch {
    res.redirect('/join');
  }
  console.log(users);
});

//Logout function
app.post('/main', (req, res) => {
  const logout = req.body.logout;
  //logout session
  if (logout == logout) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
        console.log("Error in logout");
      } else {
        res.redirect('/');
        console.log("Logout successful");
      }
    });
  }
});


//orderDetails page
app.get('/orderDetails', (req, res) => {
  res.render('orderDetails.ejs');
});

//productDetails page
app.get('/productDetails/:id', (req, res) => {
  console.log(req.params.id);
  const query = db.prepare(findProductById);
  query.get(req.params.id, function (err, row) {
    res.render('productDetails.ejs', {name:row.productName,
                                      img:row.productImg,
                                      price:row.productPrice/100,
                                      desc:row.productDesc});
  });
});

//productUpload page ------ data is not getting stored in database
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


//test.ejs page
app.get('/test', (req, res) => {
  res.render('test.ejs');
});


//userDashboard.ejs page
app.get('/userDashboard', (req, res) => {
  // If admin?
  const query = db.prepare(findAllbyID);
  query.get(req.user.id, function (err, row) {
    console.log(row.name);
    console.log(row.email);
    console.log(row.phone);
    console.log(row.address);
    res.render('userDashboard.ejs', { name: row.name, 
                                      email: row.email,
                                      phone: row.phone,
                                      address: row.address});
  });
});

//userDashboardEdit.ejs page
app.get('/userDashboardEdit', (req, res) => {
  // If admin?
  const query = db.prepare(findAllbyID);
  query.get(req.user.id, function (err, row) {
    console.log(row.name);
    console.log(row.email);
    res.render('userDashboardEdit.ejs', { name: row.name, 
                                          email: row.email,
                                          phone: row.phone,
                                          address: row.address});
  });
});

app.post('/userDashboardEdit', async (req, res) => {
  if (req.body.checkedbox){
    passport.authenticate('local', async function (err, user, info) {
      if (err) {
        console.log(err);
        return next(err);
      }
      if (!user) {
        console.log(info);
        console.log("Access Denied");
        return res.redirect('/userDashboardEdit');
      }

      console.log("correct");

      if(req.body.repassword === req.body.repassword2) {
        try {
          const hashedPassword = await bcrypt.hash(req.body.repassword, 10);
          sql = `UPDATE users SET name = ?, email = ?, phone = ?, address = ?, password = ? WHERE id = ?`;
          db.run(sql, [req.body.name, req.body.email, req.body.phone, req.body.address, hashedPassword,req.user.id], (err) => {
            if (err) return console.error(err.message);
          })
          res.redirect('/userDashboard');
        } catch {
          res.redirect('/userDashboardEdit');
        }
      }

    })(req, res);
  } else {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        console.log(err);
        return next(err);
      }
      if (!user) {
        console.log(info);
        console.log("Access Denied");
        return res.redirect('/userDashboardEdit');
      }

      console.log("correct");
      try {
        sql = `UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?`;
        db.run(sql, [req.body.name, req.body.email, req.body.phone, req.body.address, req.user.id], (err) => {
          if (err) return console.error(err.message);
        })
        res.redirect('/userDashboard');
      } catch {
        res.redirect('/userDashboardEdit');
      }
    })(req, res);
  }
});

//adminDashboard.ejs page
app.get('/adminDashboard', (req, res) => {
  const query = db.prepare(findAllbyID);
  query.get(req.user.id, function (err, row) {
    console.log(row.role);
    if (row.role == 'Admin') {
      const query2 = db.prepare(findAllCustomers);
      query2.all('Customer', function (err, rows) {
        let x = 0;
        let id = [];
        let name = [];
        let email = [];
        while(x!=rows.length) {
          id.push(rows[x].id);
          name.push(rows[x].name);
          email.push(rows[x].email);
          x++;
        }
        res.render('adminDashboard.ejs', {length:rows.length,
                                          id:id,
                                          name:name,
                                          email:email});
      });

      
      console.log("Role is admin");
    } else {
      console.log("Role is other");
      res.redirect('/userDashboard');
    }
  });
});

//writeReview.ejs page
app.get('/writeReview', (req, res) => {
  res.render('writeReview.ejs');
});

app.post('/deleteAccount', (req, res) => {
  try {
    let accountID = req.user.id;
    sql = `DELETE FROM users WHERE id = ?`;

    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
        console.log("Error in logout");
      } else {
        console.log("Logout successful");
      }
    });

    db.run(sql, [accountID], (err) => {
      if (err) return console.error(err.message);
    })

    res.redirect('/login1');
  } catch {
    res.redirect('/userDashboard');
  }
})

app.post('/goToProduct', function (req, res, next) {
    res.redirect('/productDetails/' + req.body.goProduct);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});