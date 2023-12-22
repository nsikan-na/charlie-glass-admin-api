-- CREATE OR REPLACE VIEW quote_summary_view AS
-- SELECT
--     q.id AS quote_id,
--     q.user_id,
--     q.creation_date,
--     q.expense, 
--     q.isSigned,
--     q.signature_date,
--     qr.name AS receiver_name,
--     GROUP_CONCAT(qs.service_label) AS service_array
-- FROM quote q
-- LEFT JOIN quote_receiver qr ON q.id = qr.quote_id
-- LEFT JOIN (
--     SELECT 
--         qs.quote_id,
--         s.label AS service_label
--     FROM quote_service qs
--     LEFT JOIN service s ON qs.service_id = s.id
--     WHERE qs.isActive = '1' AND s.isActive = '1'
-- ) AS qs ON q.id = qs.quote_id
-- WHERE q.isActive = '1'
-- GROUP BY
--     q.id, q.user_id, q.creation_date, q.expense, q.isSigned, q.signature_date, qr.name;
-- SELECT * FROM quote_summary_view;




-- DROP VIEW IF EXISTS quote_item_view;
-- CREATE VIEW quote_item_view AS
-- SELECT
--     qi.quote_id,
--     qi.id as item_id,
--     qi.description,
--     qi.quantity,
--     qi.price
-- FROM
--     quote q
-- LEFT JOIN quote_item qi ON q.id = qi.quote_id
-- where q.isActive = '1'
-- and qi.isActive = '1';
-- SELECT * FROM quote_item_view;



-- DROP VIEW IF EXISTS quote_service_view;
-- CREATE VIEW quote_service_view AS
-- SELECT
--     qs.quote_id,
--     qs.service_id,
--     s.label as service_label
-- FROM
--     quote_service qs
-- LEFT JOIN quote q ON q.id = qs.quote_id
-- LEFT JOIN service s ON qs.service_id = s.id
-- where q.isActive = '1'
-- and qs.isActive = '1';
-- SELECT * FROM quote_service_view;




-- DROP VIEW IF EXISTS quote_summary_view;
-- CREATE VIEW quote_summary_view AS
-- SELECT
--     q.id as quote_id,
--     q.user_id,
--     q.creation_date,
--     q.expense, 
--     q.isSigned,
--     q.signature_date,
--     qr.name as receiver_name,
--     -- qr.street as receiver_street,
--     -- qr.city as receiver_city,
--     -- qr.state as receiver_state,
--     -- qr.zip as receiver_zip,
--    GROUP_CONCAT(qs.service_label) AS service_array
-- FROM (
--     SELECT * 
--     FROM quote q
--     WHERE q.isActive = '1'
-- ) as q
-- LEFT JOIN (
--     SELECT *
--     FROM quote_receiver qr
-- ) as qr ON q.id = qr.quote_id
-- LEFT JOIN (
--     SELECT 
--         qs.quote_id,
--         s.id as service_id,
--         s.label as service_label
--     FROM quote_service qs
--     LEFT JOIN service s ON qs.service_id = s.id
--     WHERE qs.isActive = '1' AND s.isActive = '1'
-- ) as qs ON q.id = qs.quote_id
-- GROUP BY
--     q.id, q.user_id, q.creation_date, q.expense, q.isSigned, q.signature_date, qr.name, qr.street, qr.city, qr.state, qr.zip;
-- SELECT * 
-- FROM quote_summary_view;