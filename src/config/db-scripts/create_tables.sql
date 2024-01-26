-- DROP TABLE IF EXISTS user;
-- CREATE TABLE user (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(255),
--     password VARCHAR(255),
--     name VARCHAR(255),
--     isActive int
-- );

DROP TABLE IF EXISTS invoice;
CREATE TABLE invoice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    expense decimal(10,2),
    creation_date DATE,
    isSigned int,
    signature_date date,
    isActive int
);

DROP TABLE IF EXISTS invoice_receiver;
CREATE TABLE invoice_receiver (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,
    name VARCHAR(255),
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip VARCHAR(255)
);

DROP TABLE IF EXISTS invoice_item;
CREATE TABLE  invoice_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,
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

DROP TABLE IF EXISTS invoice_service;
CREATE TABLE invoice_service (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,
    service_id INT,
    isActive int
);


