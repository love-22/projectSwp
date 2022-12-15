const {db, findUserbyEmail, insertNewUser, insertTwoFA} = require('../database');
const bcrypt = require('bcrypt');

const getRegister = (req, res) => {
    res.render('join.ejs');
};

const postRegister = async (req, res) => {
    try {
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
    } catch {
      console.log("Failure in register.js - Could not register a new user.");
      res.redirect('/join');
    }
};

module.exports = {
    getRegister,
    postRegister
};