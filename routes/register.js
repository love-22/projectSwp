const {db, findUserbyEmail, insertNewUser, insertTwoFA} = require('../database');
const bcrypt = require('bcrypt');
const { validationResult } = require("express-validator");

const getRegister = (req, res) => {
    res.render('join.ejs', {length:0, alert:''});
};

const postRegister = async (req, res) => {
    try {
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
        res.render('join.ejs', {
          length:errMsg.length,
          alert:errMsg
        })
      } else {
        if (req.body.password == req.body.repassword){
          const hashedPassword = await bcrypt.hash(req.body.password, 10); //hashing password
        
          db.run(insertNewUser, [req.body.name, req.body.email, hashedPassword], (err) => {
            if (err) {
              console.log(err);
              res.redirect('/join');
            } else {
              const query = db.prepare(findUserbyEmail);
              query.get(req.body.email, function (err, row) {
                  db.run(insertTwoFA, [row.id], (err) => {
                    if (err) return console.error(err.message);
                    res.redirect('/login1');
                  });
              });
            }
          });
        } else {
          let alerts = [];
          alerts.push("Passwords do not match.");
          res.render('join.ejs', {
            length:alerts.length,
            alert:alerts
          });
        }
        
      }
      
    } catch {
      console.log("Failure in register.js - Could not register a new user.");
      res.redirect('/join');
    }
};

module.exports = {
    getRegister,
    postRegister
};