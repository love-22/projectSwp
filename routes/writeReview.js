const {db, findIfReviewExist, insertReview, updateReview} = require('../database');

const getWriteReview = (req, res) => {
    res.render('writeReview.ejs', {product:req.params.id});
};

const postWriteReview = (req, res) => {
    // Check if user already wrote a review
    console.log(req.body.userReview)
    const query = db.prepare(findIfReviewExist);
    query.get(req.user.id, req.params.id, function (err, row) {
      if (!row){
        // User never submitted a review
        // and wants to.
        db.run(insertReview, [req.user.id, req.params.id, req.body.userReview], (err) => {
            if (err) return console.error(err.message);
            res.redirect('/productDetails/' + req.params.id);
        });
      } else {
        // User submitted a review before
        // and wants to submit another
        // for another product.
        if (row.productId != req.params.id){
            db.run(insertReview, [req.user.id, req.params.id, req.body.userReview], (err) => {
                if (err) return console.error(err.message);
                res.redirect('/productDetails/' + req.params.id);
            });
        } else {
            // User already has a review 
            // submitted for this product
            // and wants to update it.
            db.run(updateReview, [req.body.userReview, req.user.id, req.params.id], (err) => {
                if (err) return console.error(err.message);
                res.redirect('/productDetails/' + req.params.id);
            });
        }
      }
    });
};

module.exports = {
    getWriteReview,
    postWriteReview
}