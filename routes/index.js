const {db, updateLockStatus} = require('../database');
const {findAllProducts} = require('../database');

const getMain = (req, res) => {
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
};

const postLogout = (req, res) => {
    const logout = req.body.logout;
    //logout session
    if (logout == logout) {
      req.session.destroy(function (err) {
        if (err) {
          console.log(err);
          console.log("Error in logout");
        } else {
          db.run(updateLockStatus, ['Locked', req.user.id], (err) => {
            if (err) return console.error(err.message);
          });
          res.redirect('/');
          console.log("Logout successful");
        }
      });
    }
};

const goToProductOnClick = (req, res, next) => {
    res.redirect('/productDetails/' + req.body.goProduct);
};

module.exports = {
    getMain,
    postLogout,
    goToProductOnClick
};