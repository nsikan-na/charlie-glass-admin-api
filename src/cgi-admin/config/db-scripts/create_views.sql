CREATE OR REPLACE VIEW invoice_summary_view AS
SELECT
    q.user_id,
    q.id AS invoice_id,
    q.creation_date,
    sum(qi.price) as revenue,
    q.expense, 
    sum(qi.price) - q.expense as profit,
    q.isSigned,
    q.signature_date,
    qr.name AS receiver_name
FROM invoice q
LEFT JOIN invoice_receiver qr ON q.id = qr.invoice_id
LEFT JOIN(
    select 
    qi.invoice_id,
    sum(qi.price) as price
    from invoice_item qi
    where qi.isActive = '1'
    group by qi.invoice_id
) as qi on q.id = qi.invoice_id
WHERE q.isActive = '1'
GROUP BY
    q.id, q.user_id, q.creation_date, q.expense, q.isSigned, q.signature_date, qr.name, qi.invoice_id;
SELECT * FROM invoice_summary_view;



DROP VIEW IF EXISTS invoice_item_view;
CREATE VIEW invoice_item_view AS
SELECT
    q.user_id,
    qi.invoice_id,
    qi.id as item_id,
    qi.description as item_description,
    qi.quantity as item_quantity,
    qi.price as item_price
FROM
    invoice q
LEFT JOIN invoice_item qi ON q.id = qi.invoice_id
where q.isActive = '1'
and qi.isActive = '1';
SELECT * FROM invoice_item_view;



DROP VIEW IF EXISTS invoice_service_view;
CREATE VIEW invoice_service_view AS
SELECT
    q.user_id,
    qs.invoice_id,
    qs.service_id,
    s.label as service_label
FROM
    invoice_service qs
LEFT JOIN invoice q ON q.id = qs.invoice_id
LEFT JOIN service s ON qs.service_id = s.id
where q.isActive = '1'
and qs.isActive = '1';
SELECT * FROM invoice_service_view;




DROP VIEW IF EXISTS invoice_receiver_view;
CREATE VIEW invoice_receiver_view AS
SELECT
    q.user_id,
    q.id as invoice_id,
    qr.name as receiver_name,
    qr.street as receiver_street,
    qr.city as receiver_city,
    qr.state as receiver_state,
    qr.zip as receiver_zip
FROM invoice q
LEFT JOIN invoice_receiver qr ON q.id = qr.invoice_id
WHERE q.isActive = '1';
SELECT *  FROM invoice_receiver_view;




DROP VIEW IF EXISTS profit_report_view;
CREATE VIEW profit_report_view AS(

Select 
user_id,
signature_date,
sum(revenue) as revenue, 
sum(expense) as expense, 
sum(revenue) - sum(expense) as profit
from (
    SELECT
    q.user_id,
    q.id AS invoice_id,
    q.creation_date,
    sum(qi.price) as revenue,
    q.expense, 
    sum(qi.price) - q.expense as profit,
    q.isSigned,
    q.signature_date,
    qr.name AS receiver_name
FROM invoice q
LEFT JOIN invoice_receiver qr ON q.id = qr.invoice_id
LEFT JOIN(
    select 
    qi.invoice_id,
    sum(qi.price) as price
    from invoice_item qi
    where qi.isActive = '1'
    group by qi.invoice_id
) as qi on q.id = qi.invoice_id
WHERE q.isActive = '1'
GROUP BY
    q.id, q.user_id, q.creation_date, q.expense, q.isSigned, q.signature_date, qr.name, qi.invoice_id
    ) as my_view
where isSigned = '1'
group by user_id, signature_date
);
SELECT * FROM profit_report_view;



DROP VIEW IF EXISTS service_count_report_view;
CREATE VIEW service_count_report_view AS
select 
user_id,
signature_date,
service_id,
service_label,
count(service_label) as service_count
 from (
SELECT
    q.user_id,
    signature_date,
    qs.service_id,
    s.label as service_label
FROM
    invoice_service qs
LEFT JOIN invoice q ON q.id = qs.invoice_id
LEFT JOIN service s ON qs.service_id = s.id
where q.isActive = '1'
and qs.isActive = '1'
AND q.isSigned = '1') as test 
group by user_id, signature_date, service_id, service_label;
SELECT * FROM service_count_report_view;


