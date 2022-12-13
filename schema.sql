CREATE TABLE users(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT DEFAULT '0830000000',
    address TEXT DEFAULT 'IFSC NCI',
    role TEXT DEFAULT 'Customer',
    creationDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE product(
    id INTEGER PRIMARY KEY,
    productName TEXT NOT NULL,
    productPrice INTEGER NOT NULL,
    productDesc TEXT NOT NULL,
    productImg TEXT UNIQUE,
    ProductCreationDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE token(
    id INTEGER PRIMARY KEY,
    token TEXT DEFAULT '0000000',
    userId INTEGER NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id)
);

CREATE TABLE review(
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    review TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (productId) REFERENCES product(id)
);

CREATE TABLE cart(
    id INTEGER PRIMARY KEY,
    userId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (productId) REFERENCES products(id)
);

INSERT INTO users(name, email, password, role) VALUES ('Eduard', 'e@e.com', '$2b$10$6uZtu4CVNG378HXpkfwsjumXVWzenACbfYG7QVFdDmC4MklUxOwlu', 'Admin');
INSERT INTO users(name, email, password) VALUES ('John', 'j@j.com', '$2b$10$po3DZmFAntAhYYCSqZQ7UuC8EItx762MeKRVLIQe.ga0GpgzlLgi.');
INSERT INTO users(name, email, password) VALUES ('Sarah', 's@s.com', '$2b$10$che2OeUAg9ZnFHcC/uxrBuXbB0CTwF/6g8qiIQN9KQmCym5MqzGsK');
INSERT INTO product(productName, productPrice, productDesc, productImg) VALUES ('Desktop', '125000', 'Desktop computer with alot of RAM.', 'img/desktop.jpg');
INSERT INTO product(productName, productPrice, productDesc, productImg) VALUES ('Laptop', '89900', 'Laptop with alot of RAM.', 'img/laptop.jpg');
INSERT INTO product(productName, productPrice, productDesc, productImg) VALUES ('Phone', '60000', 'Phone with alot of RAM', 'img/phone.jpg');
INSERT INTO product(productName, productPrice, productDesc, productImg) VALUES ('Monitor', '45900', '120k Monitor will melt your face off.', 'img/monitor.jpg');
INSERT INTO product(productName, productPrice, productDesc, productImg) VALUES ('Gaming Chair', '10000', 'Gaming chair makes you game better.', 'img/chair.jpg');
INSERT INTO product(productName, productPrice, productDesc, productImg) VALUES ('Gaming Socks', '900', 'Gaming socks for running downstairs to get refreshments.', 'img/socks.jpg');
INSERT INTO product(productName, productPrice, productDesc, productImg) VALUES ('Gaming RGB lights', '66600', 'RGB lights for your room so people think youre cool.', 'img/rgblights.jpg');
INSERT INTO product(productName, productPrice, productDesc, productImg) VALUES ('Gaming Racing Wheel', '75000', 'Racing wheel for those gaming moments', 'img/racingwheel.jpg');
INSERT INTO token(userID) VALUES (1);
INSERT INTO token(userID) VALUES (2);
INSERT INTO token(userID) VALUES (3);
INSERT INTO review(userId, productId, review) VALUES ('2', '1', 'Best gaming computer ever');
INSERT INTO review(userId, productId, review) VALUES ('3', '1', 'This nicely complements my gaming socks!');
INSERT INTO cart(userId, productId, quantity) VALUES ('1', '3', '4');
INSERT INTO cart(userId, productId, quantity) VALUES ('1', '5', '3');
INSERT INTO cart(userId, productId, quantity) VALUES ('1', '1', '3');
INSERT INTO cart(userId, productId, quantity) VALUES ('1', '2', '7');