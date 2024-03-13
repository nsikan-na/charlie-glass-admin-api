-- Creating invoice summary view
CREATE OR REPLACE VIEW invoice_summary_view AS
SELECT
    q.user_id,
    q.id AS invoice_id,
    q.creation_date,
    SUM(qi.price) AS revenue,
    q.expense, 
    SUM(qi.price) - q.expense AS profit,
    q."isSigned",
    q.signature_date,
    qr.name AS receiver_name
FROM invoice q
LEFT JOIN invoice_receiver qr ON q.id = qr.invoice_id
LEFT JOIN (
    SELECT 
        qi.invoice_id,
        SUM(qi.price) AS price
    FROM invoice_item qi
    WHERE qi."isActive" = 1
    GROUP BY qi.invoice_id
) AS qi ON q.id = qi.invoice_id
WHERE q."isActive" = 1
GROUP BY
    q.id, q.user_id, q.creation_date, q.expense, q."isSigned", q.signature_date, qr.name;

-- Creating invoice item view
DROP VIEW IF EXISTS invoice_item_view;
CREATE VIEW invoice_item_view AS
SELECT
    q.user_id,
    qi.invoice_id,
    qi.id AS item_id,
    qi.description AS item_description,
    qi.quantity AS item_quantity,
    qi.price AS item_price
FROM
    invoice q
JOIN invoice_item qi ON q.id = qi.invoice_id
WHERE q."isActive" = 1 AND qi."isActive" = 1;

-- Creating invoice service view
DROP VIEW IF EXISTS invoice_service_view;
CREATE VIEW invoice_service_view AS
SELECT
    q.user_id,
    qs.invoice_id,
    qs.service_id,
    s.label AS service_label
FROM
    invoice_service qs
JOIN invoice q ON q.id = qs.invoice_id
JOIN service s ON qs.service_id = s.id
WHERE q."isActive" = 1 AND qs."isActive" = 1;

-- Creating invoice receiver view
DROP VIEW IF EXISTS invoice_receiver_view;
CREATE VIEW invoice_receiver_view AS
SELECT
    q.user_id,
    q.id AS invoice_id,
    qr.name AS receiver_name,
    qr.street AS receiver_street,
    qr.city AS receiver_city,
    qr.state AS receiver_state,
    qr.zip AS receiver_zip
FROM invoice q
JOIN invoice_receiver qr ON q.id = qr.invoice_id
WHERE q."isActive" = 1;

-- Creating profit report view
DROP VIEW IF EXISTS profit_report_view;
CREATE VIEW profit_report_view AS
SELECT 
    user_id,
    signature_date,
    SUM(revenue) AS revenue, 
    SUM(expense) AS expense, 
    SUM(revenue) - SUM(expense) AS profit
FROM (
    SELECT
        q.user_id,
        q.id AS invoice_id,
        q.creation_date,
        SUM(qi.price) AS revenue,
        q.expense, 
        SUM(qi.price) - q.expense AS profit,
        q."isSigned",
        q.signature_date,
        qr.name AS receiver_name
    FROM invoice q
    LEFT JOIN invoice_receiver qr ON q.id = qr.invoice_id
    LEFT JOIN (
        SELECT 
            qi.invoice_id,
            SUM(qi.price) AS price
        FROM invoice_item qi
        WHERE qi."isActive" = 1
        GROUP BY qi.invoice_id
    ) AS qi ON q.id = qi.invoice_id
    WHERE q."isActive" = 1 AND q."isSigned" = 1
    GROUP BY
        q.id, q.user_id, q.creation_date, q.expense, q."isSigned", q.signature_date, qr.name
) AS signed_invoices
GROUP BY user_id, signature_date;

-- Creating service count report view
DROP VIEW IF EXISTS service_count_report_view;
CREATE VIEW service_count_report_view AS
SELECT 
    user_id,
    signature_date,
    service_id,
    service_label,
    COUNT(service_label) AS service_count
FROM (
    SELECT
        q.user_id,
        q.signature_date,
        qs.service_id,
        s.label AS service_label
    FROM
        invoice_service qs
    JOIN invoice q ON q.id = qs.invoice_id
    JOIN service s ON qs.service_id = s.id
    WHERE q."isActive" = 1 AND qs."isActive" = 1 AND q."isSigned" = 1
) AS services_signed
GROUP BY user_id, signature_date, service_id, service_label;
