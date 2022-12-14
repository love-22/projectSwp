const nodemailer = require("nodemailer");
const {passport} = require('../passport-config');
const tokens = {};
const {db, findUserToken, updateTwoFA, findUserToLogAttempt2FA, updateUserAttempt2FA, updateUserlocked2FA} = require('../database');
const { validationResult } = require("express-validator");

const getLogin = (req, res) => {
    res.render('login1.ejs', {length:0, alert:''});
};

const postLogin = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      console.log(errors.array());
      console.log(errors.array().length);
      let errMsg = [];
      let x = 0;
      while (x != errors.array().length){
        errMsg.push(errors.array()[x].msg)
        x++;
      }
      const alerte = errors.array();
      res.render('login1.ejs', {
        length:errMsg.length,
        alert:errMsg
      })
    } else {
      const email = req.body.email;
      passport.authenticate('local', function (err, user, info, attempt) {
        if (err) {
          console.log(err);
          return next(err);
        }
        if (!user) {
          console.log(info);
          let alerts = [];
          alerts.push(info.message);
          res.render('login1.ejs', {
            length:alerts.length,
            alert:alerts
          });
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
    } 
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
    subject: "SWP Login Token", // Mail Subject

    //Random 6 digit code email format
    text: "Your Login code is: " + token, // plain text body
    html: "Your Login code is: " + token // html body
    });

    // Message sent
    console.log("Token sent");
}

const getLogin2FA = (req, res) => {
    res.render('login2.ejs', {length:0, alert:''});
};

const postLogin2FA = (req, res, next) => {
  const errors = validationResult(req);
    if(!errors.isEmpty()) {
      console.log(errors.array());
      console.log(errors.array().length);
      let errMsg = [];
      let x = 0;
      while (x != errors.array().length){
        errMsg.push(errors.array()[x].msg)
        x++;
      }
      res.render('login2.ejs', {
        length:errMsg.length,
        alert:errMsg
      })
    } else {

      const token = req.body.token
      const query = db.prepare(findUserToken);
      query.get(req.user.id, function (err, row) {
        console.log(row.token);
        if (row.token == token) {
          console.log("Access Granted");

          const query22 = db.prepare(findUserToLogAttempt2FA);
          query22.get(req.user.id, async function (err, rows) {
            if(parseInt(rows.locked) < parseInt(Date.now())) {
              console.log("No longer locked 2FA.");
              db.run(updateUserAttempt2FA, ['0', req.user.id], (err) => {
                if (err) return console.error(err.message);
              });
              db.run(updateUserlocked2FA, ['0', req.user.id], (err) => {
                if (err) return console.error(err.message);
              });
              // This should go to an authentication thing.
              return res.redirect('/');
            } else {
              // 2fa locked 5 mins
              let lock = [];
              lock.push("Token Locked for 5 minutes due to excessive attempts.");
              res.render('login2.ejs', {
                length:lock.length,
                alert:lock
              })
            }
          })

        }
        else {
          console.log("Access Denied");
          const query2 = db.prepare(findUserToLogAttempt2FA);
          query2.get(req.user.id, function (err, row) {
            if (parseInt(row.attempt) != 3){
              let tempAttempt = parseInt(row.attempt);
              tempAttempt++;
              db.run(updateUserAttempt2FA, [tempAttempt, req.user.id], (err) => {
                if (err) return console.error(err.message);
              });

              if (tempAttempt == 3) {
                db.run(updateUserlocked2FA, [Date.now() + 300000, req.user.id], (err) => {
                  if (err) return console.error(err.message);
                });
              }
              let arr = [];
              arr.push("Token Incorrect");
              res.render('login2.ejs', {
                length:arr.length,
                alert:arr
              })
            }

            if(parseInt(row.attempt) == 3) {
              let arr = [];
              arr.push("Token Locked for 5 minutes due to excessive attempts.");
              res.render('login2.ejs', {
                length:arr.length,
                alert:arr
              })
            }
          });


        }
      });
    }
}

module.exports = {
    getLogin,
    postLogin,
    getLogin2FA,
    postLogin2FA
};