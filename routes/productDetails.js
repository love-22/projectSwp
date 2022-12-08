const {db} = require('../database');
const {findProductById} = require('../database');

const getProductDetails = (req, res) => {
    console.log(req.params.id);
    const query = db.prepare(findProductById);
    query.get(req.params.id, function (err, row) {
      res.render('productDetails.ejs', {
        name: row.productName,
        img: row.productImg,
        price: row.productPrice / 100,
        desc: row.productDesc
      });
    });
};

module.exports = {
    getProductDetails
}