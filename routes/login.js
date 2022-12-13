const nodemailer = require("nodemailer");
const {passport} = require('../passport-config');
const tokens = {};
const {db, findUserToken, updateTwoFA} = require('../database');

const getLogin = (req, res) => {
    res.render('login1.ejs');
};

const postLogin = (req, res, next) => {
    const email = req.body.email;
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
      //does not yet work
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
  
        sendMail(email, req).catch(console.error);
  
        console.log("Access Granted");
        return res.redirect('/login2');
      });
    })(req, res, next);
};

async function sendMail(email, req) {
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

    db.run(updateTwoFA, [token, req.user.id], (err) => {
      if (err) return console.error(err.message);
    });
    
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
}

const getLogin2FA = (req, res) => {
    res.render('login2.ejs');
};

const postLogin2FA = (req, res, next) => {
    //const email = req.body.email
    const token = req.body.token
    //if (tokens[email] == token) {
    // FINDING USER TOKEN SHOULD BE COMPLETED HERE... ALREADY DONE.
    const query = db.prepare(findUserToken);
    query.get(req.user.id, function (err, row) {
      console.log(row.token);
      if (row.token == token) {
        console.log("Access Granted");
        return res.redirect('/');
      }
      else {
        console.log("Access Denied");
        return res.redirect('/login2');
      }
    });

}

module.exports = {
    getLogin,
    postLogin,
    getLogin2FA,
    postLogin2FA
};

// app.post('/login1', passport.authenticate('local', {
//   successRedirect: '/login2', //if login is successful
//   failureRedirect: '/login1', //if login is not successful
//   failureFlash: true
// }));