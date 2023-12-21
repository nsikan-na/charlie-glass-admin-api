DROP VIEW IF EXISTS quote_summary_view;
CREATE VIEW quote_summary_view AS
SELECT
    q.id as quote_id,
    q.user_id,
    q.creation_date,
    q.expense, 
    q.isSigned,
    q.signature_date
FROM (
    select * 
    from quote q
    where q.isActive = '1'
) as q;
SELECT * FROM quote_summary_view;




    -- GROUP_CONCAT(s.label) AS service_array

-- DROP VIEW IF EXISTS quote_item_view;
-- CREATE VIEW quote_item_view AS
-- SELECT
--     qi.id as item_id,
--     qi.quote_id,
--     q.user_id,
--     qr.name as receiver_name,
--     q.creation_date as quote_creation_date,
--     qi.description,
--     qi.quantity,
--     qi.price
-- FROM
--     quote q
-- LEFT JOIN quote_receiver qr ON qr.quote_id = q.id
-- LEFT JOIN quote_item qi ON q.id = qi.quote_id
-- where q.isActive = '1';
-- -- SELECT * FROM quote_item_view;



-- DROP VIEW IF EXISTS quote_service_view;
-- CREATE VIEW quote_service_view AS
-- SELECT
--     qs.quote_id,
--     q.user_id,
--     q.creation_date as quote_creation_date,
--     qr.name as receiver_name,
--     qs.service_id,
--     s.label as service_label
-- FROM
--     quote_service qs
-- LEFT JOIN quote q ON q.id = qs.quote_id
-- LEFT JOIN quote_receiver qr ON qr.quote_id = q.id
-- LEFT JOIN service s ON qs.service_id = s.id
-- where q.isActive = '1';
-- -- SELECT * FROM quote_service_view;



-- DROP VIEW IF EXISTS quote_receiver_view;
-- CREATE VIEW quote_receiver_view AS
-- SELECT
--     qr.quote_id,
--     q.user_id,
--     q.creation_date as quote_creation_date,
--     qr.name as receiver_name,
--     qr.street as receiver_street,
--     qr.city as receiver_city,
--     qr.state as receiver_state,
--     qr.zip as receiver_zip
-- FROM
--     quote_receiver qr
-- LEFT JOIN quote q ON qr.quote_id = q.id
-- where q.isActive = '1';
-- SELECT * FROM quote_receiver_view;

