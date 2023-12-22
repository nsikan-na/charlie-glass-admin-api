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
      throw new Error(`Error retrieving quotes: ${error.message}`);
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
      throw new Error(`Error retrieving quotes: ${error.message}`);
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
      throw new Error(`Error retrieving quotes: ${error.message}`);
    }
  };

  const getQuoteCartById = async ({ id }: { id: string }) => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );
      const query = `
      SELECT 
      cart_item_id, 
      description,
      quantity,
      price
      FROM quote_cart_view
      where user_id = ?
      and quote_id = ?;
      `;

      const [rows, fields] = await connection.execute(query, [user_id, id]);

      connection.end();
      logger.log(query);
      return rows;
    } catch (error: any) {
      throw new Error(`Error retrieving quotes: ${error.message}`);
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
      throw new Error(`Error retrieving quotes: ${error.message}`);
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
      FROM quote_receiver_info_view
      where user_id = ? 
      and quote_id = ?;
      `;
      const [rows, fields] = await connection.execute(query, [user_id, id]);

      connection.end();
      logger.log(query);
      return rows;
    } catch (error: any) {
      throw new Error(`Error retrieving quotes: ${error.message}`);
    }
  };

  const saveQuote = async ({
    receiver_name,
    creation_date,
    street,
    city,
    state,
    zip,
    cart,
    services,
  }: any) => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );
      await connection.beginTransaction();
      const quoteQuery = `INSERT INTO quote (user_id, creation_date) VALUES (?, ?)`;

      const [insertTable1]: any = await connection.execute(quoteQuery, [
        user_id,
        creation_date,
      ]);
      logger.log(quoteQuery);
      const lastPrimaryKey = insertTable1.insertId;

      const receiverInfoQuery =
        "INSERT INTO quote_receiver_info (quote_id, name, street, city, state, zip) VALUES (?, ?, ?, ?, ?, ?);";

      await connection.execute(receiverInfoQuery, [
        lastPrimaryKey,
        receiver_name,
        street,
        city,
        state,
        zip,
      ]);
      logger.log(receiverInfoQuery);

      const cartQuery =
        "INSERT INTO quote_cart (quote_id, description, quantity, price) VALUES (?, ?, ?, ?);";
      logger.log(cart);
      await Promise.all(
        cart.map((cartItem: any) =>
          connection.execute(cartQuery, [
            lastPrimaryKey,
            cartItem.description,
            cartItem.quantity,
            cartItem.price,
          ])
        )
      );

      const serviceQuery =
        "INSERT INTO quote_service (quote_id, service_id) VALUES (?, ?);";
      logger.log(serviceQuery);
      await Promise.all(
        services.map((service_id: any) =>
          connection.execute(serviceQuery, [lastPrimaryKey, service_id])
        )
      );

      await connection.commit();

      await connection.end();

      return `Quote ${lastPrimaryKey} saved successfully`;
    } catch (error: any) {
      throw new Error(`Error saving quotes: ${error.message}`);
    }
  };

  return {
    getAllQuotes,
    getQuoteById,
    getQuoteServicesById,
    getQuoteCartById,
    saveQuote,
    getQuoteReceiverInfoById,
    getAllServices,
  };
};
