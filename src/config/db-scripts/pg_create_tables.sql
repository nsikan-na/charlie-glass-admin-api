-- Drop and recreate the user table
DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    name VARCHAR(255),
    "isActive" INT
);

-- Drop and recreate the invoice table
DROP TABLE IF EXISTS invoice;
CREATE TABLE invoice (
    id SERIAL PRIMARY KEY,
    user_id INT,
    expense DECIMAL(10,2),
    creation_date DATE,
    "isSigned" INT,
    signature_date DATE,
    "isActive" INT
);

-- Drop and recreate the invoice_receiver table
DROP TABLE IF EXISTS invoice_receiver;
CREATE TABLE invoice_receiver (
    id SERIAL PRIMARY KEY,
    invoice_id INT,
    name VARCHAR(255),
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip VARCHAR(255)
);

-- Drop and recreate the invoice_item table
DROP TABLE IF EXISTS invoice_item;
CREATE TABLE invoice_item (
    id SERIAL PRIMARY KEY,
    invoice_id INT,
    quantity INT,
    description VARCHAR(255),
    price DECIMAL(10, 2),
    "isActive" INT
);

-- Drop and recreate the service table
DROP TABLE IF EXISTS service;
CREATE TABLE service (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255),
    "isActive" INT
);

-- Drop and recreate the invoice_service table
DROP TABLE IF EXISTS invoice_service;
CREATE TABLE invoice_service (
    id SERIAL PRIMARY KEY,
    invoice_id INT,
    service_id INT,
    "isActive" INT
);
