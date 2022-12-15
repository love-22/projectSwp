const {db, findProductById, findReview, findIfProductInCart, 
      insertProductToCart, updateProductInCart} = require('../database');

const getProductDetails = (req, res) => {
    console.log(req.params.id);
    const query = db.prepare(findProductById);
    query.get(req.params.id, function (err, row) {
      const query2 = db.prepare(findReview);
      query2.all(req.params.id, function (err, rows) {
        let x = 0;
        let reviewName = [];
        let reviews = [];
        while(x!=rows.length) {
          reviewName.push(rows[x].name);
          reviews.push(rows[x].review);
          x++;
        }
        res.render('productDetails.ejs', {
          id: row.id,
          name: row.productName,
          img: row.productImg,
          price: row.productPrice / 100,
          desc: row.productDesc,
          lengthofReviews:rows.length,
          reviewName:reviewName,
          review:reviews
        });
      });
    });
};

const addToCart = (req, res) => {
  // Search if item is already in cart.
  const query = db.prepare(findIfProductInCart);
  query.get(req.body.productToAddToCart, req.user.id, function (err, row) {
    if(!row){
      //If product was not already in cart.
      db.run(insertProductToCart, [req.user.id, req.body.productToAddToCart, parseInt(req.body.productQuantity)], (err) => {
        if (err) return console.error(err.message);
        res.redirect('/cart');
      });
    } else {
      // If product was already in cart add to quantity.
      db.run(updateProductInCart, [parseInt(row.quantity)+parseInt(req.body.productQuantity), req.body.productToAddToCart, req.user.id], (err) => {
        if (err) return console.error(err.message);
        res.redirect('/cart');
      });
    }
  });
};

module.exports = {
    getProductDetails,
    addToCart
}