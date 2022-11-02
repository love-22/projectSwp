CREATE TABLE users(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
);

CREATE TABLE products(
    id INTEGER PRIMARY KEY,
    productName TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT NOT NULL,
    uploadImage TEXT NOT NULL,

);
 
/* CREATE TABLE orders(
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (productId) REFERENCES products(id)
);

CREATE TABLE cart(
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (productId) REFERENCES products(id)
);

CREATE TABLE wishlist(
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (productId) REFERENCES products(id)
);

CREATE TABLE reviews(
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    review TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (productId) REFERENCES products(id)
);

CREATE TABLE search(
    id INTEGER PRIMARY KEY,
    search TEXT NOT NULL
);

CREATE TABLE category(
    id INTEGER PRIMARY KEY,
    categoryName TEXT NOT NULL
); */

