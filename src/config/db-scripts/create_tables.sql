-- DROP TABLE IF EXISTS user;
-- CREATE TABLE user (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(255),
--     password VARCHAR(255),
--     name VARCHAR(255),
--     isActive int
-- );

DROP TABLE IF EXISTS quote;
CREATE TABLE quote (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    expense decimal(10,2),
    creation_date DATE,
    isSigned int,
    signature_date date,
    isActive int
);

DROP TABLE IF EXISTS quote_receiver;
CREATE TABLE quote_receiver (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id INT,
    name VARCHAR(255),
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip VARCHAR(255)
);

DROP TABLE IF EXISTS quote_item;
CREATE TABLE  quote_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id INT,
    quantity INT,
    description VARCHAR(255),
    price DECIMAL(10, 2),
    isActive int
);

DROP TABLE IF EXISTS service;
CREATE TABLE service (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255),
    isActive int
);

DROP TABLE IF EXISTS quote_service;
CREATE TABLE quote_service (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id INT,
    service_id INT,
    isActive int
);


