CREATE TABLE users(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
);

/* CREATE TABLE products(
    id INTEGER PRIMARY KEY,
    productName TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT NOT NULL,
    uploadImage TEXT NOT NULL,
    users TEXT NOT NULL,
    FOREIGN KEY (users) REFERENCES users(id)
);
 */
/* CREATE TABLE orders(
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE cart(
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
); */
