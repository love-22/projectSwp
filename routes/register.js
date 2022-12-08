const {db} = require('../database');
const bcrypt = require('bcrypt');

const getRegister = (req, res) => {
    res.render('join.ejs');
};

const postRegister = async (req, res) => {
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
};

module.exports = {
    getRegister,
    postRegister
};