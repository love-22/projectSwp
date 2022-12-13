const sqlite3 = require('sqlite3').verbose();

const userLogIn = "SELECT id, email, password FROM users WHERE email = $1;";
const findUserbyID = "SELECT id FROM users WHERE id = $1;";
const findUserbyEmail = "SELECT id FROM users WHERE email = $1;";
const findAllbyID = "SELECT name, email, phone, address, role FROM users WHERE id = $1;";
const findAllCustomers = "SELECT id, name, email, phone, address, role FROM users WHERE role = $1;";
const findAllProducts = "SELECT id, productName, productPrice, productDesc, productImg, ProductCreationDate FROM product;";
const findProductById = "SELECT id, productName, productPrice, productDesc, productImg, ProductCreationDate FROM product WHERE id = $1;";
const insertNewUser = "INSERT INTO users(name, email, password) VALUES ($1, $2, $3);";
const insertTwoFA = "INSERT INTO token(userId) VALUES ($1);";
const findUserToken = "SELECT users.id, token.id, token FROM users JOIN token on users.id = token.id WHERE users.id = $1;";
const updateTwoFA = "UPDATE token SET token = $1 WHERE userId = $2";
const findReview = "SELECT name, review FROM users JOIN review ON users.id = review.userid WHERE productId = $1;";
const findIfReviewExist = "SELECT productId FROM review WHERE userId = $1;";
const insertReview = "INSERT INTO review(userId, productId, review) VALUES ($1, $2, $3)";
const updateReview = "UPDATE review set review = $1 WHERE userId = $2 AND productId = $3;";
const findCart = "SELECT productName, quantity, productPrice, product.id, productDesc, productImg FROM cart JOIN product ON cart.productId = product.id WHERE userId = $1;";
const deleteProduct = "DELETE FROM cart WHERE productId = $1 AND userId = $2;";
const findIfProductInCart = "SELECT quantity FROM cart WHERE productId = $1 AND userId = $2;";
const insertProductToCart = "INSERT INTO cart(userId, productId, quantity) VALUES ($1, $2, $3);";
const updateProductInCart = "UPDATE cart set quantity = $1 WHERE productId = $2 AND userId = $3;";
const insertProduct = "INSERT INTO product(productName, productPrice, productDesc, productImg) VALUES ($1, $2, $3, $4);";
const findProducts = "SELECT id, productName, productPrice, productDesc, productImg from product;";
const deleteProductFully = "DELETE FROM product WHERE id = $1;";
const insertIntoOrder = "INSERT INTO orders(productName, productPrice, productDesc, productImg, userId, quantity) VALUES ($1, $2, $3, $4, $5, $6);";
const findOrderedItems = "SELECT productName, productPrice, productDesc, productImg, userId, quantity FROM orders WHERE userId = $1;";


const db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) return console.error(err.message);
});

module.exports = {
    userLogIn,
    findUserToken,
    findUserbyEmail,
    findUserbyID,
    findAllbyID,
    findAllCustomers,
    findAllProducts,
    findProductById,
    insertNewUser,
    findIfReviewExist,
    insertTwoFA,
    updateTwoFA,
    findReview,
    insertReview,
    updateReview,
    findCart,
    deleteProduct,
    findIfProductInCart,
    insertProductToCart,
    updateProductInCart,
    insertProduct,
    findProducts,
    deleteProductFully,
    insertIntoOrder,
    findOrderedItems,
    db
};