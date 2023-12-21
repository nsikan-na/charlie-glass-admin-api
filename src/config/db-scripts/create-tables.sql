-- DROP TABLE IF EXISTS invoice_receiver_info;
-- CREATE TABLE   invoice_receiver_info (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     invoice_id INT,
--     name VARCHAR(255),
--     street VARCHAR(255),
--     city VARCHAR(255),
--     state VARCHAR(255),
--     zip VARCHAR(255)
-- );

DROP TABLE IF EXISTS invoice;
CREATE TABLE   invoice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    creation_date DATE
);

-- DROP TABLE IF EXISTS invoice_cart;

-- CREATE TABLE  invoice_cart (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     invoice_id INT,
--     quantity INT,
--     description VARCHAR(255),
--     price DECIMAL(10, 2)
-- );

-- DROP TABLE IF EXISTS invoice_service;

-- CREATE TABLE invoice_service (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     invoice_id INT,
--     service_id INT,
-- );

-- DROP TABLE IF EXISTS service;

-- CREATE TABLE service (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     label VARCHAR(255),
-- );

