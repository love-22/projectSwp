const sqlite3 = require('sqlite3').verbose();

const userLogIn = "SELECT id, email, password FROM users WHERE email = $1;";
const findUserbyID = "SELECT id FROM users WHERE id = $1;";
const findAllbyID = "SELECT name, email, phone, address, role FROM users WHERE id = $1;";
const findAllCustomers = "SELECT id, name, email, phone, address, role FROM users WHERE role = $1;";
const findAllProducts = "SELECT id, productName, productPrice, productDesc, productImg, ProductCreationDate FROM product";
const findProductById = "SELECT productName, productPrice, productDesc, productImg, ProductCreationDate FROM product WHERE id = $1";

const db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) return console.error(err.message);
});

module.exports = {
    userLogIn,
    findUserbyID,
    findAllbyID,
    findAllCustomers,
    findAllProducts,
    findProductById,
    db
};