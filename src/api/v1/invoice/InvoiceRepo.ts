import db from "../../../config/db-config/db";

export const useInvoiceRepo = ({ user_id }: { user_id: string }) => {
  const getAllInvoices = async ({
    name,
    invoice_id,
    toDate,
    fromDate,
    page,
    pageSize,
    isSigned,
  }: any) => {
    const client = await db.connect();
    try {
      let query = `
        SELECT *
        FROM public.invoice_summary_view
        WHERE user_id = $1
      `;
      const params = [user_id];
      let paramCounter = 1;

      if (name) {
        paramCounter++;
        query += ` AND receiver_name LIKE $${paramCounter}`;
        params.push(`%${name}%`);
      }
      if (invoice_id) {
        paramCounter++;
        query += ` AND invoice_id LIKE $${paramCounter}`;
        params.push(`%${invoice_id}%`);
      }
      if (isSigned === "true") {
        query += ` AND "isSigned" = '1'`;
      } else if (isSigned === "false") {
        query += ` AND "isSigned" = '0'`;
      }

      if (toDate && fromDate) {
        query += ` AND ((creation_date BETWEEN $${paramCounter + 1} AND $${
          paramCounter + 2
        }) OR (signature_date BETWEEN $${paramCounter + 3} AND $${
          paramCounter + 4
        }))`;
        params.push(fromDate, toDate, fromDate, toDate);
        paramCounter += 4;
      }

      query += " ORDER BY invoice_id DESC";

      if (page && pageSize) {
        if (+page <= 0) {
          throw new Error("Invalid page number");
        }
        const offset = (page - 1) * pageSize;
        paramCounter++;
        query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
        params.push(pageSize, offset.toString());
      }

      console.log(query);
      const { rows } = await client.query(query, params);
      return rows;
    } catch (error) {
      console.log(error);
    } finally {
      client.release();
    }
  };

  const getAllServices = async () => {
    const client = await db.connect();
    try {
      const query = `
        SELECT DISTINCT id, label
        FROM service
      `;
      const { rows } = await client.query(query);
      return rows;
    } catch (error) {
      console.log(error);
    } finally {
      client.release();
    }
  };

  const getInvoiceById = async ({ id, user_id }: any) => {
    const client = await db.connect();
    try {
      const query = `
        SELECT *
        FROM invoice
        WHERE user_id = $1 AND id = $2;
      `;
      const { rows } = await client.query(query, [user_id, id]);
      return rows;
    } catch (error) {
      console.log(`Error in getInvoiceById: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  };

  const getInvoiceItemsById = async ({ id, user_id }: any) => {
    const client = await db.connect();
    try {
      const query = `
        SELECT
          "item_id" AS "id",
          "item_description" AS "description",
          "item_quantity" AS "quantity",
          "item_price" AS "price"
        FROM invoice_item_view
        WHERE "user_id" = $1 AND "invoice_id" = $2;
      `;
      const { rows } = await client.query(query, [user_id, id]);
      return rows;
    } catch (error) {
      console.log(`Error in getInvoiceItemsById: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  };

  const getInvoiceServicesById = async ({ id, user_id }: any) => {
    const client = await db.connect();
    try {
      const query = `
        SELECT
          "service_id",
          "service_label"
        FROM invoice_service_view
        WHERE "user_id" = $1 AND "invoice_id" = $2;
      `;
      const { rows } = await client.query(query, [user_id, id]);
      return rows;
    } catch (error) {
      console.log(`Error in getInvoiceServicesById: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  };

  const getInvoiceReceiverInfoById = async ({ id, user_id }: any) => {
    const client = await db.connect();
    try {
      const query = `
        SELECT
          "receiver_name",
          "receiver_street" AS "street",
          "receiver_city" AS "city",
          "receiver_state" AS "state",
          "receiver_zip" AS "zip"
        FROM invoice_receiver_view
        WHERE "user_id" = $1 AND "invoice_id" = $2;
      `;
      const { rows } = await client.query(query, [user_id, id]);
      return rows;
    } catch (error) {
      console.log(`Error in getInvoiceReceiverInfoById: ${error}`);
      throw new Error(`Error in getInvoiceReceiverInfoById Repo: ${error}`);
    } finally {
      client.release();
    }
  };

  const saveInvoice = async ({
    user_id,
    receiver_name,
    creation_date,
    street,
    city,
    state,
    zip,
    items,
    services,
  }: any) => {
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      const invoiceQuery = `
      INSERT INTO invoice (user_id, creation_date, "isSigned", "isActive")
      VALUES ($1, $2, 0, 1) RETURNING id;
    `;
      const { rows } = await client.query(invoiceQuery, [
        user_id,
        creation_date,
      ]);
      const lastPrimaryKey = rows[0].id;

      const receiverInfoQuery = `
      INSERT INTO invoice_receiver (invoice_id, name, street, city, state, zip)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
      await client.query(receiverInfoQuery, [
        lastPrimaryKey,
        receiver_name,
        street,
        city,
        state,
        zip,
      ]);

      const itemsQuery = `
      INSERT INTO invoice_item (invoice_id, description, quantity, price, "isActive")
      VALUES ($1, $2, $3, $4, 1);
    `;
      for (let item of items) {
        await client.query(itemsQuery, [
          lastPrimaryKey,
          item.description,
          item.quantity,
          item.price,
        ]);
      }

      const serviceQuery = `
      INSERT INTO invoice_service (invoice_id, service_id, "isActive")
      VALUES ($1, $2, 1);
    `;
      for (let service_id of services) {
        await client.query(serviceQuery, [lastPrimaryKey, service_id]);
      }

      await client.query("COMMIT");
      return `Invoice #${lastPrimaryKey} created successfully`;
    } catch (error) {
      console.log(error);
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  };

  const signInvoice = async ({ id, user_id, expense, signature_date }: any) => {
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      const invoiceQuery = `
        UPDATE public.invoice
        SET "isSigned" = 1, "expense" = $1, "signature_date" = $2
        WHERE "user_id" = $3 AND "id" = $4;
      `;
      await client.query(invoiceQuery, [expense, signature_date, user_id, id]);
      await client.query("COMMIT");
      return `Invoice #${id} signed successfully`;
    } catch (error) {
      console.log(error);
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  };

  const resetInvoices = async () => {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const deleteQuery = `
        DELETE FROM public.invoice WHERE user_id = '0';
      `;
      await client.query(deleteQuery);

      const insertQuery = `
        INSERT INTO public.invoice (user_id, id, expense, creation_date, "isSigned", signature_date, "isActive") VALUES
        (0, 1, NULL, '2023-11-05', 0, NULL, 1),
        (0, 2, NULL, '2023-11-15', 0, NULL, 1),
        (0, 3, NULL, '2023-12-02', 0, NULL, 1),
        (0, 4, NULL, '2023-11-08', 0, NULL, 1),
        (0, 5, NULL, '2023-11-25', 0, NULL, 1),
        (0, 6, NULL, '2023-12-10', 0, NULL, 1),
        (0, 7, 27, '2023-11-20', 1, '2024-01-25', 1),
        (0, 8, 50, '2023-11-28', 1, '2024-01-20', 1),
        (0, 9, 35, '2023-12-15', 1, '2024-01-17', 1);
      `;
      await client.query(insertQuery);

      await client.query("COMMIT");
      return "User 0 Invoices Reset";
    } catch (error) {
      console.log(error);
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  };

  const deleteInvoice = async ({ id }: any) => {
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      const invoiceQuery = `
      UPDATE invoice
      SET "isActive" = 0
      WHERE "user_id" = $1 AND "id" = $2;
    `;
      await client.query(invoiceQuery, [user_id, id]);
      await client.query("COMMIT");
      return `Invoice #${id} deleted successfully`;
    } catch (error) {
      await client.query("ROLLBACK");
      console.log(error);
      throw error;
    } finally {
      client.release();
    }
  };

  return {
    getAllInvoices,
    getInvoiceById,
    getInvoiceServicesById,
    getInvoiceItemsById,
    saveInvoice,
    getInvoiceReceiverInfoById,
    getAllServices,
    signInvoice,
    resetInvoices,
    deleteInvoice,
  };
};
