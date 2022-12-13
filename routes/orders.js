const {db, findOrderedItems} = require('../database');

const getOrderedItems = (req, res) => {
    const query = db.prepare(findOrderedItems);
    query.all(req.user.id, function (err, rows) {
          let tempPrice = 0;
          let priceToPay = 0;
          let x = 0;
          let productName = [];
          let quantity = [];
          let productPrice = [];
          let productImage = [];
          let spent = [];
          while(x!=rows.length) {
            tempPrice = rows[x].productPrice/100 * rows[x].quantity;
            priceToPay += tempPrice;
            productName.push(rows[x].productName);
            quantity.push(rows[x].quantity);
            productPrice.push("€" + rows[x].productPrice/100);
            spent.push("€" + tempPrice);
            productImage.push(rows[x].productImg);
            x++;
          };
          
          res.render('orders.ejs', {image:productImage,
                                    name:productName,
                                    price:productPrice,
                                    quantity:quantity,
                                    spent:spent,
                                    length:rows.length});
    });
};

module.exports = {
    getOrderedItems
};