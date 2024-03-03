import dbConnection from "../../../config/db-config/db-connection";

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
    try {
      const connection = await dbConnection();
      let query = `
      SELECT *
      FROM invoice_summary_view
      WHERE user_id = ?
    `;

      const params: (string | number)[] = [user_id];

      if (name) {
        query += " AND receiver_name LIKE ?";
        params.push(`%${name}%`);
      }

      if (invoice_id) {
        query += " AND invoice_id LIKE ?";
        params.push(`%${invoice_id}%`);
      }

      if (isSigned === "true") {
        query += " AND isSigned = '1'";
      } else if (isSigned === "false") {
        query += " AND isSigned = '0'";
      } else {
      }

      if (toDate && fromDate) {
        query +=
          " AND ((creation_date between ? and ?) or (signature_date between ? and ?))";
        params.push(`${fromDate}`);
        params.push(`${toDate}`);
        params.push(`${fromDate}`);
        params.push(`${toDate}`);
      }

      query += " ORDER BY invoice_id DESC";

      if (page && pageSize) {
        if (+page <= 0) {
          throw new Error("Invalid page number");
        }
        const offset: any = (page - 1) * pageSize;
        query += " LIMIT ? OFFSET ?";
        params.push(+pageSize, +offset);
      }
      console.log(query);
      const [rows, fields] = await connection.execute(query, params);
      connection.release();
      return rows;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  const getAllServices = async () => {
    try {
      const connection = await dbConnection();
      const query = `
      SELECT distinct id, label
      FROM service
      `;

      const [rows, fields] = await connection.execute(query, []);

      connection.release();
      return rows;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  const getInvoiceById = async ({ id }: { id: string }) => {
    try {
      const connection = await dbConnection();
      const query = `
  SELECT *
  FROM invoice
  where user_id = ?
  and id = ?
`;
      const [rows, fields] = await connection.execute(query, [user_id, id]);

      connection.release();
      return rows;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  const getInvoiceItemsById = async ({ id }: { id: string }) => {
    try {
      const connection = await dbConnection();
      const query = `
      SELECT 
      item_id, 
      item_description,
      item_quantity,
      item_price
      FROM invoice_item_view
      where user_id = ?
      and invoice_id = ?;
      `;

      const [rows, fields] = await connection.execute(query, [user_id, id]);

      connection.release();
      return rows;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  const getInvoiceServicesById = async ({ id }: { id: string }) => {
    try {
      const connection = await dbConnection();
      const query = `
      SELECT 
      service_id,
      service_label
      FROM invoice_service_view
      where user_id = ? 
      and invoice_id = ?;
      `;

      const [rows, fields] = await connection.execute(query, [user_id, id]);

      connection.release();
      return rows;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };
  const getInvoiceReceiverInfoById = async ({ id }: { id: string }) => {
    try {
      const connection = await dbConnection();

      const query = `
      SELECT 
      receiver_name,
      receiver_street,
      receiver_city,
      receiver_state,
      receiver_zip
      FROM invoice_receiver_view
      where user_id = ? 
      and invoice_id = ?;
      `;
      const [rows, fields] = await connection.execute(query, [user_id, id]);

      connection.release();
      return rows;
    } catch (error: any) {
      throw new Error(
        `Error in getInvoiceReceiverInfoById Repo: ${error.message}`
      );
    }
  };

  const saveInvoice = async ({
    receiver_name,
    creation_date,
    street,
    city,
    state,
    zip,
    items,
    services,
  }: any) => {
    try {
      const connection = await dbConnection();
      await connection.beginTransaction();
      const invoiceQuery =
        "INSERT INTO invoice (user_id, creation_date, isSigned, isActive) VALUES (?, ?, 0, 1)";

      const [insertTable1]: any = await connection.execute(invoiceQuery, [
        user_id,
        creation_date,
      ]);
      const lastPrimaryKey = insertTable1.insertId;

      const receiverInfoQuery =
        "INSERT INTO invoice_receiver (invoice_id, name, street, city, state, zip) VALUES (?, ?, ?, ?, ?, ?);";

      await connection.execute(receiverInfoQuery, [
        lastPrimaryKey,
        receiver_name,
        street,
        city,
        state,
        zip,
      ]);

      const itemsQuery =
        "INSERT INTO invoice_item (invoice_id, description, quantity, price, isActive) VALUES (?, ?, ?, ?, 1);";
      await Promise.all(
        items.map((itemsItem: any) =>
          connection.execute(itemsQuery, [
            lastPrimaryKey,
            itemsItem.description,
            itemsItem.quantity,
            itemsItem.price,
          ])
        )
      );

      const serviceQuery =
        "INSERT INTO invoice_service (invoice_id, service_id, isActive) VALUES (?, ?, 1);";
      await Promise.all(
        services.map((service_id: any) =>
          connection.execute(serviceQuery, [lastPrimaryKey, service_id])
        )
      );

      await connection.commit();

      await connection.release();

      return `Quote #${lastPrimaryKey} created successfully`;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  const signInvoice = async ({ id, expense, signature_date }: any) => {
    try {
      const connection = await dbConnection();
      await connection.beginTransaction();

      const invoiceQuery = `
      Update invoice
      set isSigned = 1, expense = ?, signature_date = ?
      where user_id = ? and id = ?;
      `;

      await connection.execute(invoiceQuery, [
        expense,
        signature_date,
        user_id,
        id,
      ]);
      await connection.commit();
      await connection.release();
      return `Quote #${id} signed successfully`;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  const resetInvoices = async () => {
    try {
      const connection = await dbConnection();

      const deleteQuery = `
      DELETE FROM invoice where user_id = '0';
      `;
      const [deleteQueryRows, deleteQueryFields] = await connection.execute(
        deleteQuery,
        []
      );

      const insertQuery = `
      INSERT INTO invoice (user_id, id, expense, creation_date, isSigned, signature_date, isActive) VALUES
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
      const [insertRows, insertFields] = await connection.execute(
        insertQuery,
        []
      );

      connection.release();
      return "User 0 Invoices Reset";
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  const deleteInvoice = async ({ id }: any) => {
    try {
      const connection = await dbConnection();
      await connection.beginTransaction();

      const invoiceQuery = `
      Update invoice
      set isActive = 0
      where user_id = ? and id = ?;
      `;

      await connection.execute(invoiceQuery, [user_id, id]);
      await connection.commit();
      await connection.release();
      return `Quote #${id} deleted successfully`;
    } catch (error: any) {
      throw new Error(`${error.message}`);
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
