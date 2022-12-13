const {db, findProductById, findReview} = require('../database');

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

module.exports = {
    getProductDetails
}