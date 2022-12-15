const {db} = require('../database');
const {findAllbyID} = require('../database');
const {passport} = require('../passport-config');
const bcrypt = require('bcrypt');
const { validationResult } = require("express-validator");

const getUserDashboardEdit = (req, res) => {
    // If admin?
    const query = db.prepare(findAllbyID);
    query.get(req.user.id, function (err, row) {
      res.render('userDashboardEdit.ejs', { name: row.name, 
                                            email: row.email,
                                            phone: row.phone,
                                            address: row.address,
                                            length:0,
                                            alert:""});
    });
};

const postUserDashboardEdit =  async (req, res) => {
  const errors = validationResult(req);
    if(!errors.isEmpty()) {
      let errMsg = [];
      let x = 0;
      while (x != errors.array().length){
        errMsg.push(errors.array()[x].msg)
        x++;
      }
      const query = db.prepare(findAllbyID);
      query.get(req.user.id, function (err, row) {
        res.render('userDashboardEdit.ejs', { name: row.name, 
                                            email: row.email,
                                            phone: row.phone,
                                            address: row.address,
                                            length:errMsg.length,
                                            alert:errMsg});
      });
    } else {
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
    
          console.log("inside repassword");
    
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
          } else {
            let alerts = [];
            alerts.push("Passwords do not match.");
            query.get(req.user.id, function (err, row) {
              res.render('userDashboardEdit.ejs', { name: row.name, 
                                                  email: row.email,
                                                  phone: row.phone,
                                                  address: row.address,
                                                  length:alerts.length,
                                                  alert:alerts});
            });
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
    
          console.log("inside no password change");
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
    }
    
};

module.exports = {
    getUserDashboardEdit,
    postUserDashboardEdit
};