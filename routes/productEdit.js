const {db, findProducts, deleteProductFully} = require('../database');

const getProductEdit = (req, res) => {
    const query = db.prepare(findProducts);
    query.all(function (err, rows) {
          let tempPrice = 0;
          let x = 0;
          let productId = [];
          let productName = [];
          let productPrice = [];
          let productDesc = [];
          let productImg = [];
        
          while(x!=rows.length) {
            tempPrice = rows[x].productPrice/100;
            productId.push(rows[x].id);
            productName.push(rows[x].productName);
            productPrice.push("€" + tempPrice);
            productImg.push(rows[x].productImg);
            productDesc.push(rows[x].productDesc);
            x++;
          };
        
          res.render('productEdit.ejs', {id:productId,
                                         name:productName,
                                         price:productPrice,
                                         image:productImg,
                                         desc:productDesc,
                                         length:rows.length});
    });
};

const postProductEdit = (req, res) => {
    db.run(deleteProductFully, [req.body.productToRemove], (err) => {
        if (err) return console.error(err.message);
        res.redirect('/productEdit');
      });
};

module.exports = {
    getProductEdit,
    postProductEdit
};