-- TRUNCATE table user;
-- INSERT INTO user (username, password, name, isActive) VALUES (NULL, NULL, 'Admin', 1);
-- INSERT INTO user (username, password, name, isActive) VALUES (NULL, NULL, 'DemoAdmin', 1);
-- INSERT INTO user (username, password, name, isActive) VALUES (NULL, NULL, 'DemoAdmin2', 1);
-- select * from user;


TRUNCATE table quote;
INSERT INTO quote (user_id, expense, creation_date, isSigned, signature_date, isActive) VALUES
(1, NULL, '2023-11-05', 0, NULL, 1),
(1, NULL, '2023-11-15', 0, NULL, 1),
(1, NULL, '2023-12-02', 0, NULL, 1),
(2, NULL, '2023-11-08', 0, NULL, 1),
(2, NULL, '2023-11-25', 0, NULL, 1),
(2, NULL, '2023-12-10', 0, NULL, 1),
(3, NULL, '2023-11-20', 0, NULL, 1),
(3, NULL, '2023-11-28', 0, NULL, 1),
(3, NULL, '2023-12-15', 0, NULL, 1);
-- select * from quote;


TRUNCATE table quote_receiver;
INSERT INTO quote_receiver (quote_id, name, street, city, state, zip) VALUES
(1, 'John Doe', '123 Main St', 'New York City', 'NY', '10001'),
(2, 'Jane Smith', '456 Oak St', 'Los Angeles', 'CA', '90001'),
(3, 'Bob Johnson', '789 Pine St', 'Chicago', 'IL', '60601'),
(4, 'Alice Brown', '101 Elm St', 'Houston', 'TX', '77001'),
(5, 'Charlie Davis', '202 Maple St', 'Phoenix', 'AZ', '85001'),
(6, 'Eva Wilson', '303 Birch St', 'Philadelphia', 'PA', '19101'),
(7, 'Frank Miller', '404 Cedar St', 'San Antonio', 'TX', '78201'),
(8, 'Grace Taylor', '505 Walnut St', 'San Diego', 'CA', '92101'),
(9, 'Henry White', '606 Cherry St', 'Dallas', 'TX', '75201');
-- select * from quote_receiver;



TRUNCATE table quote_item;
INSERT INTO quote_item (quote_id, quantity, description, price, isActive) VALUES
(1, 2, 'Product A', 50.00, 1),
(1, 3, 'Product B', 25.00, 1),
(1, 1, 'Product C', 75.00, 1),
(2, 1, 'Product X', 120.00, 1),
(2, 2, 'Product Y', 90.00, 1),
(2, 2, 'Product Z', 40.00, 1),
(3, 4, 'Product M', 15.00, 1),
(3, 1, 'Product N', 60.00, 1),
(3, 3, 'Product O', 30.00, 1),
(4, 2, 'Product Q', 80.00, 1),
(4, 1, 'Product R', 45.00, 1),
(4, 2, 'Product S', 35.00, 1),
(5, 3, 'Product J', 50.00, 1),
(5, 2, 'Product K', 70.00, 1),
(5, 1, 'Product L', 25.00, 1),
(6, 2, 'Product D', 60.00, 1),
(6, 3, 'Product E', 30.00, 1),
(6, 1, 'Product F', 45.00, 1),
(7, 1, 'Product G', 80.00, 1),
(7, 2, 'Product H', 40.00, 1),
(7, 2, 'Product I', 55.00, 1),
(8, 3, 'Product U', 70.00, 1),
(8, 1, 'Product V', 25.00, 1),
(8, 2, 'Product W', 50.00, 1),
(9, 2, 'Product P', 40.00, 1),
(9, 1, 'Product Q', 30.00, 1),
(9, 3, 'Product R', 25.00, 1);
-- select * from quote_item;

TRUNCATE table service;
INSERT INTO service (label, isActive) VALUES
('Shower Doors', 1),
('Shelves', 1),
('Glass Partition', 1),
('Store Fronts', 1),
('Mirrors', 1),
('Others', 1);
-- select * from service;

TRUNCATE table quote_service;
INSERT INTO quote_service (quote_id, service_id, isActive) VALUES
(1, 1, 1),
(1, 3, 1),
(1, 5, 1),
(2, 2, 1),
(2, 4, 1),
(2, 6, 1),
(3, 1, 1),
(3, 2, 1),
(3, 3, 1),
(4, 3, 1),
(4, 5, 1),
(4, 6, 1),
(5, 1, 1),
(5, 4, 1),
(5, 5, 1),
(6, 2, 1),
(6, 3, 1),
(6, 6, 1),
(7, 1, 1),
(7, 4, 1),
(7, 5, 1),
(8, 3, 1),
(8, 6, 1),
(8, 2, 1),
(9, 2, 1),
(9, 4, 1),
(9, 5, 1);
-- select * from quote_service;