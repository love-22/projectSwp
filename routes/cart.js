const {db, findCart, deleteProduct, insertIntoOrder} = require('../database');

const getCart = (req, res) => {
    const query = db.prepare(findCart);
    query.all(req.user.id, function (err, rows) {
          let tempPrice = 0;
          let priceToPay = 0;
          let x = 0;
          let productId = [];
          let productName = [];
          let quantity = [];
          let productPrice = [];
          let productImage = [];
          while(x!=rows.length) {
            tempPrice = rows[x].productPrice/100 * rows[x].quantity;
            priceToPay += tempPrice;
            productId.push(rows[x].id);
            productName.push(rows[x].productName);
            quantity.push(rows[x].quantity);
            productPrice.push("€" + tempPrice);
            productImage.push(rows[x].productImg);
            x++;
          };

          if(!rows) {
            res.render('cart.ejs', {id:productId,
                                    name:productName,
                                    length:rows.length,
                                    quantity:quantity,
                                    price:productPrice,
                                    image:productImage,
                                    payment: "Nothing in cart"});
          } else {
            res.render('cart.ejs', {id:productId,
                                    name:productName,
                                    length:rows.length,
                                    quantity:quantity,
                                    price:productPrice,
                                    image:productImage,
                                    payment: "Pay €" + priceToPay + " now."});
          }
          
    });
};

const removeProduct = (req, res) => {
    db.run(deleteProduct, [req.body.productToRemove, req.user.id], (err) => {
        if (err) return console.error(err.message);
        res.redirect('/cart');
      });
};

const payCart = (req, res) => {
    const query = db.prepare(findCart);
    query.all(req.user.id, function (err, rows) {
          let x = 0;
          while(x!=rows.length) {
            db.run(insertIntoOrder, [rows[x].productName, rows[x].productPrice, rows[x].productDesc, rows[x].productImg, req.user.id, rows[x].quantity], (err) => {
              if (err) return console.error(err.message);
            });
            db.run(deleteProduct, [rows[x].id, req.user.id], (err) => {
              if (err) return console.error(err.message);
            });
            
            x++;
          };
          res.redirect('/');
        })
};

module.exports = {
    getCart,
    removeProduct,
    payCart
};