import dbConnection from "../../../config/db-config/db-connection";

export const useQuoteRepo = ({ user_id }: { user_id: string }) => {
  const getAllQuotes = async ({
    name,
    quote_id,
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
      FROM quote_summary_view
      WHERE user_id = ?
    `;

      const params: (string | number)[] = [user_id];

      if (name) {
        query += " AND receiver_name LIKE ?";
        params.push(`%${name}%`);
      }

      if (quote_id) {
        query += " AND quote_id LIKE ?";
        params.push(`%${quote_id}%`);
      }

      if (isSigned === "true") {
        query += " AND isSigned = '1'";
      } else if (isSigned === "false") {
        query += " AND isSigned = '0'";
      } else {
      }

      if (toDate && fromDate) {
        query += " AND creation_date between ? and ?";
        params.push(`${fromDate}`);
        params.push(`${toDate}`);
      }

      query += " ORDER BY quote_id DESC";

      if (page && pageSize) {
        if (+page <= 0) {
          throw new Error("Invalid page number");
        }
        const offset: any = (page - 1) * pageSize;
        query += " LIMIT ? OFFSET ?";
        params.push(+pageSize, +offset);
      }

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

  const getQuoteById = async ({ id }: { id: string }) => {
    try {
      const connection = await dbConnection();
      const query = `
  SELECT *
  FROM quote
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

  const getQuoteItemsById = async ({ id }: { id: string }) => {
    try {
      const connection = await dbConnection();
      const query = `
      SELECT 
      item_id, 
      item_description,
      item_quantity,
      item_price
      FROM quote_item_view
      where user_id = ?
      and quote_id = ?;
      `;

      const [rows, fields] = await connection.execute(query, [user_id, id]);

      connection.release();
      return rows;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  const getQuoteServicesById = async ({ id }: { id: string }) => {
    try {
      const connection = await dbConnection();
      const query = `
      SELECT 
      service_id,
      service_label
      FROM quote_service_view
      where user_id = ? 
      and quote_id = ?;
      `;

      const [rows, fields] = await connection.execute(query, [user_id, id]);

      connection.release();
      return rows;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };
  const getQuoteReceiverInfoById = async ({ id }: { id: string }) => {
    try {
      const connection = await dbConnection();

      const query = `
      SELECT 
      receiver_name,
      receiver_street,
      receiver_city,
      receiver_state,
      receiver_zip
      FROM quote_receiver_view
      where user_id = ? 
      and quote_id = ?;
      `;
      const [rows, fields] = await connection.execute(query, [user_id, id]);

      connection.release();
      return rows;
    } catch (error: any) {
      throw new Error(
        `Error in getQuoteReceiverInfoById Repo: ${error.message}`
      );
    }
  };

  const saveQuote = async ({
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
      const quoteQuery =
        "INSERT INTO quote (user_id, creation_date, isSigned, isActive) VALUES (?, ?, 0, 1)";

      const [insertTable1]: any = await connection.execute(quoteQuery, [
        user_id,
        creation_date,
      ]);
      const lastPrimaryKey = insertTable1.insertId;

      const receiverInfoQuery =
        "INSERT INTO quote_receiver (quote_id, name, street, city, state, zip) VALUES (?, ?, ?, ?, ?, ?);";

      await connection.execute(receiverInfoQuery, [
        lastPrimaryKey,
        receiver_name,
        street,
        city,
        state,
        zip,
      ]);

      const itemsQuery =
        "INSERT INTO quote_item (quote_id, description, quantity, price, isActive) VALUES (?, ?, ?, ?, 1);";
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
        "INSERT INTO quote_service (quote_id, service_id, isActive) VALUES (?, ?, 1);";
      await Promise.all(
        services.map((service_id: any) =>
          connection.execute(serviceQuery, [lastPrimaryKey, service_id])
        )
      );

      await connection.commit();

      await connection.release();

      return `Quote #${lastPrimaryKey} saved successfully`;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  const signQuote = async ({ id, expense, signature_date }: any) => {
    try {
      const connection = await dbConnection();
      await connection.beginTransaction();

      const quoteQuery = `
      Update quote
      set isSigned = 1, expense = ?, signature_date = ?
      where user_id = ? and id = ?;
      `;

      await connection.execute(quoteQuery, [
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

  const resetQuotes = async () => {
    try {
      const connection = await dbConnection();

      const deleteQuery = `
      DELETE FROM quote where user_id = '1';
      `;
      const [deleteQueryRows, deleteQueryFields] = await connection.execute(
        deleteQuery,
        []
      );

      const insertQuery = `
      INSERT INTO quote (user_id, id, expense, creation_date, isSigned, signature_date, isActive) VALUES
      (1, 1, NULL, '2023-11-05', 0, NULL, 1),
      (1, 2, NULL, '2023-11-15', 0, NULL, 1),
      (1, 3, NULL, '2023-12-02', 0, NULL, 1),
      (1, 4, NULL, '2023-11-08', 0, NULL, 1),
      (1, 5, NULL, '2023-11-25', 0, NULL, 1),
      (1, 6, NULL, '2023-12-10', 0, NULL, 1),
      (1, 7, 27, '2023-11-20', 1, '2023-01-25', 1),
      (1, 8, 50, '2023-11-28', 1, '2023-01-20', 1),
      (1, 9, 35, '2023-12-15', 1, '2023-01-17', 1);
      `;
      const [insertRows, insertFields] = await connection.execute(
        insertQuery,
        []
      );

      connection.release();
      return "User 1 Quotes Reset";
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  return {
    getAllQuotes,
    getQuoteById,
    getQuoteServicesById,
    getQuoteItemsById,
    saveQuote,
    getQuoteReceiverInfoById,
    getAllServices,
    signQuote,
    resetQuotes,
  };
};
