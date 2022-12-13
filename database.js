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

// userId INTEGER NOT NULL,
//     productId INTEGER NOT NULL,
//     review TEXT NOT NULL,
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
    db
};