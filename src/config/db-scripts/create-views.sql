-- DROP VIEW IF EXISTS invoice_cart_view;

-- CREATE VIEW invoice_cart_view AS
-- SELECT
--     ic.id as cart_item_id,
--     ic.invoice_id,
--     i.user_id,
--     iri.name as receiver_name,
--     i.creation_date as invoice_creation_date,
--     ic.description,
--     ic.quantity,
--     ic.price
-- FROM
--     invoice i
-- left join invoice_receiver_info iri on iri.invoice_id = i.id
-- LEFT JOIN invoice_cart ic ON i.id = ic.invoice_id;

-- select * from invoice_cart_view;

-- DROP VIEW IF EXISTS invoice_service_view;

-- CREATE VIEW invoice_service_view AS
-- SELECT
--     ins.invoice_id,
--     i.user_id,
-- i.creation_date as invoice_creation_date,
--     iri.name as receiver_name,
--     ins.service_id,
--     ser.label as service_label
-- FROM
--     invoice_service ins
-- LEFT JOIN invoice i ON i.id = ins.invoice_id
-- left join invoice_receiver_info iri on iri.invoice_id = i.id
-- left join service ser on ins.service_id = ser.id;

-- select * from invoice_service_view;

-- DROP VIEW IF EXISTS invoice_receiver_info_view;

-- CREATE VIEW invoice_receiver_info_view AS
-- SELECT
--     iri.invoice_id,
--     i.user_id,
--     i.creation_date as invoice_creation_date,
--     iri.name as receiver_name,
--     iri.street as receiver_street,
--     iri.city as receiver_city,
--     iri.state as receiver_state,
--     iri.zip as receiver_zip
-- FROM
--     invoice_receiver_info iri
-- LEFT JOIN invoice i on iri.invoice_id = i.id;

-- select * from invoice_receiver_info_view

-- DROP VIEW IF EXISTS invoice_view;

-- CREATE VIEW invoice_view AS
-- SELECT
--     ins.invoice_id,
--     i.user_id,
--     i.creation_date as invoice_creation_date,
--     iri.name as receiver_name,
--      GROUP_CONCAT(ser.label) AS service_array
-- FROM
--     invoice_service ins
-- LEFT JOIN invoice i ON i.id = ins.invoice_id
-- left join invoice_receiver_info iri on iri.invoice_id = i.id
-- left join service ser on ins.service_id = ser.id
-- group by ins.invoice_id, i.user_id,i.creation_date, iri.name;

-- select * from invoice_view where user_id = '4'
