import * as mysql from "mysql2/promise";

export const useQuoteRepo = ({ user_id }: { user_id: string }) => {
  const logger = console;
  // const pool = mysql.createPool({
  //   connectionLimit: 10, // Adjust as needed
  //   host: process.env.DB_HOST,
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_DATABASE,
  // });

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
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );
      let query = `
      SELECT *
      FROM quote_summary_view
      WHERE user_id = ?
    `;

      const params: (string | number)[] = [user_id];

      if (name) {
        query += ` AND receiver_name LIKE ?`;
        params.push(`%${name}%`);
      }

      if (quote_id) {
        query += ` AND quote_id LIKE ?`;
        params.push(`%${quote_id}%`);
      }

      if (isSigned === "true") {
        query += ` AND isSigned = '1'`;
      } else if (isSigned === "false") {
        query += ` AND isSigned = '0'`;
      } else {
      }

      if (toDate && fromDate) {
        query += ` AND creation_date between ? and ?`;
        params.push(`${fromDate}`);
        params.push(`${toDate}`);
      }

      query += ` ORDER BY quote_id DESC`;

      if (page && pageSize) {
        if (+page <= 0) {
          throw new Error("Invalid page number");
        }
        const offset: any = (page - 1) * pageSize;
        query += ` LIMIT ? OFFSET ?`;
        params.push(+pageSize, +offset);
      }

      logger.log(query);
      const [rows, fields] = await connection.execute(query, params);
      connection.end();
      return rows;
    } catch (error: any) {
      throw new Error(`Error in getAllQuotes Repo: ${error.message}`);
    }
  };

  const getAllServices = async () => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );
      const query = `
      SELECT distinct id, label
      FROM service
      `;

      const [rows, fields] = await connection.execute(query, []);

      connection.end();
      logger.log(query);
      return rows;
    } catch (error: any) {
      throw new Error(`Error in getAllServices Repo: ${error.message}`);
    }
  };

  const getQuoteById = async ({ id }: { id: string }) => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );
      const query = `
  SELECT *
  FROM quote
  where user_id = ?
  and id = ?
`;
      const [rows, fields] = await connection.execute(query, [user_id, id]);

      connection.end();
      logger.log(query);
      return rows;
    } catch (error: any) {
      throw new Error(`Error in getQuoteById Repo: ${error.message}`);
    }
  };

  const getQuoteItemsById = async ({ id }: { id: string }) => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );
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

      connection.end();
      logger.log(query);
      return rows;
    } catch (error: any) {
      throw new Error(`Error in getQuoteItemsById Repo: ${error.message}`);
    }
  };

  const getQuoteServicesById = async ({ id }: { id: string }) => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );
      const query = `
      SELECT 
      service_id,
      service_label
      FROM quote_service_view
      where user_id = ? 
      and quote_id = ?;
      `;

      const [rows, fields] = await connection.execute(query, [user_id, id]);

      connection.end();
      logger.log(query);
      return rows;
    } catch (error: any) {
      throw new Error(`Error in getQuoteServicesById Repo: ${error.message}`);
    }
  };
  const getQuoteReceiverInfoById = async ({ id }: { id: string }) => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );

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

      connection.end();
      logger.log(query);
      return rows;
    } catch (error: any) {
      throw new Error(`Error in getQuoteReceiverInfoById Repo: ${error.message}`);
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
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );
      await connection.beginTransaction();
      const quoteQuery = `INSERT INTO quote (user_id, creation_date, isSigned, isActive) VALUES (?, ?, 0, 1)`;

      const [insertTable1]: any = await connection.execute(quoteQuery, [
        user_id,
        creation_date,
      ]);
      logger.log(quoteQuery);
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
      logger.log(receiverInfoQuery);

      const itemsQuery =
        "INSERT INTO quote_item (quote_id, description, quantity, price, isActive) VALUES (?, ?, ?, ?, 1);";
      logger.log(items);
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
      logger.log(serviceQuery);
      await Promise.all(
        services.map((service_id: any) =>
          connection.execute(serviceQuery, [lastPrimaryKey, service_id])
        )
      );

      await connection.commit();

      await connection.end();

      return `Quote #${lastPrimaryKey} saved successfully`;
    } catch (error: any) {
      throw new Error(`Error in saveQuote Repo: ${error.message}`);
    }
  };

  const signQuote = async ({ id, expense, signature_date }: any) => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );
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
      logger.log(quoteQuery);
      await connection.commit();
      await connection.end();
      return `Quote #${id} updated successfully`;
    } catch (error: any) {
      throw new Error(`Error in signQuote Repo: ${error.message}`);
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
  };
};
