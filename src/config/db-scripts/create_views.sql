CREATE OR REPLACE VIEW quote_summary_view AS
SELECT
    q.user_id,
    q.id AS quote_id,
    q.creation_date,
    sum(qi.price) as revenue,
    q.expense, 
    sum(qi.price) - q.expense as profit,
    q.isSigned,
    q.signature_date,
    qr.name AS receiver_name
FROM quote q
LEFT JOIN quote_receiver qr ON q.id = qr.quote_id
LEFT JOIN(
    select 
    qi.quote_id,
    sum(qi.price) as price
    from quote_item qi
    where qi.isActive = '1'
    group by qi.quote_id
) as qi on q.id = qi.quote_id
WHERE q.isActive = '1'
GROUP BY
    q.id, q.user_id, q.creation_date, q.expense, q.isSigned, q.signature_date, qr.name, qi.quote_id;
SELECT * FROM quote_summary_view;



-- DROP VIEW IF EXISTS quote_item_view;
-- CREATE VIEW quote_item_view AS
-- SELECT
--     q.user_id,
--     qi.quote_id,
--     qi.id as item_id,
--     qi.description as item_description,
--     qi.quantity as item_quantity,
--     qi.price as item_price
-- FROM
--     quote q
-- LEFT JOIN quote_item qi ON q.id = qi.quote_id
-- where q.isActive = '1'
-- and qi.isActive = '1';
-- SELECT * FROM quote_item_view;



-- DROP VIEW IF EXISTS quote_service_view;
-- CREATE VIEW quote_service_view AS
-- SELECT
--     q.user_id,
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




-- DROP VIEW IF EXISTS quote_receiver_view;
-- CREATE VIEW quote_receiver_view AS
-- SELECT
--     q.user_id,
--     q.id as quote_id,
--     qr.name as receiver_name,
--     qr.street as receiver_street,
--     qr.city as receiver_city,
--     qr.state as receiver_state,
--     qr.zip as receiver_zip
-- FROM quote q
-- LEFT JOIN quote_receiver qr ON q.id = qr.quote_id
-- WHERE q.isActive = '1';
-- SELECT *  FROM quote_receiver_view;




-- DROP VIEW IF EXISTS profit_report_view;
-- CREATE VIEW profit_report_view AS
--     SELECT
--     user_id,
--     signature_date,
--     SUM(revenue) as revenue,
--     sum(expense) as expense,
--     SUM(revenue) - sum(expense) as profit
-- FROM (
--     SELECT
--         q.user_id,
--         q.signature_date,
--         expense,
--         SUM(qi.price) as revenue
--     FROM
--         quote q
--     LEFT JOIN quote_item qi ON q.id = qi.quote_id
--     WHERE
--         q.isActive = '1'
--         AND qi.isActive = '1'
--         AND q.isSigned = '1'
--     GROUP BY
--         q.user_id, q.signature_date, q.expense, q.id
-- ) AS test
-- GROUP BY
--     user_id, signature_date, expense;
-- SELECT * FROM profit_report_view;



-- DROP VIEW IF EXISTS service_count_report_view;
-- CREATE VIEW service_count_report_view AS
-- select 
-- user_id,
-- signature_date,
-- service_id,
-- service_label,
-- count(service_label) as service_count
--  from (
-- SELECT
--     q.user_id,
--     signature_date,
--     qs.service_id,
--     s.label as service_label
-- FROM
--     quote_service qs
-- LEFT JOIN quote q ON q.id = qs.quote_id
-- LEFT JOIN service s ON qs.service_id = s.id
-- where q.isActive = '1'
-- and qs.isActive = '1'
-- AND q.isSigned = '1') as test 
-- group by user_id, signature_date, service_id, service_label;
-- SELECT * FROM service_count_report_view;


