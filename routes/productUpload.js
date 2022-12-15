const {db, insertProduct} = require('../database');

const getProductUpload = (req, res) => {
    res.render('productUpload.ejs');
};

const postProductUpload = async (req, res) => {
    console.log(req.file.filename);
    try {
      db.run(insertProduct, [req.body.name, req.body.price, req.body.desc, "img/" + req.file.filename], (err) => {
        if (err) return console.error(err.message);
      })
      res.redirect('/');
    } catch {
      res.redirect('/productUpload');
    }
    console.log("Update Products... :D");
};

module.exports = {
    getProductUpload,
    postProductUpload
};