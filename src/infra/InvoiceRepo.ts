import * as mysql from "mysql2/promise";

export const useInvoiceRepo = ({ user_id }: { user_id: string }) => {
  const logger = console;
  // const pool = mysql.createPool({
  //   connectionLimit: 10, // Adjust as needed
  //   host: process.env.DB_HOST,
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_DATABASE,
  // });

  const getAllInvoices = async ({
    name,
    invoice_id,
    toDate,
    fromDate,
    page,
    pageSize,
  }: any) => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );
      let query = `
      SELECT *
      FROM invoice_view
      WHERE user_id = ?
    `;

      const params: (string | number)[] = [user_id];

      if (name) {
        query += ` AND receiver_name LIKE ?`;
        params.push(`%${name}%`);
      }

      if (invoice_id) {
        query += ` AND invoice_id LIKE ?`;
        params.push(`%${invoice_id}%`);
      }
      if (toDate && fromDate) {
        query += ` AND invoice_creation_date between ? and ?`;
        params.push(`${fromDate}`);
        params.push(`${toDate}`);
      }

      query += ` ORDER BY invoice_id DESC`;

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
      throw new Error(`Error retrieving invoices: ${error.message}`);
    }
  };

  const getAllServices = async () => {
    console.log(user_id);
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
      throw new Error(`Error retrieving invoices: ${error.message}`);
    }
  };

  const getInvoiceById = async ({ id }: { id: string }) => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );
      const query = `
  SELECT *
  FROM invoice
  where user_id = ?
  and id = ?
`;
      const [rows, fields] = await connection.execute(query, [user_id, id]);

      connection.end();
      logger.log(query);
      return rows;
    } catch (error: any) {
      throw new Error(`Error retrieving invoices: ${error.message}`);
    }
  };

  const getInvoiceCartById = async ({ id }: { id: string }) => {
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
      FROM invoice_cart_view
      where user_id = ?
      and invoice_id = ?;
      `;

      const [rows, fields] = await connection.execute(query, [user_id, id]);

      connection.end();
      logger.log(query);
      return rows;
    } catch (error: any) {
      throw new Error(`Error retrieving invoices: ${error.message}`);
    }
  };

  const getInvoiceServicesById = async ({ id }: { id: string }) => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );
      const query = `
      SELECT 
      service_id,
      service_label
      FROM invoice_service_view
      where user_id = ? 
      and invoice_id = ?;
      `;

      const [rows, fields] = await connection.execute(query, [user_id, id]);

      connection.end();
      logger.log(query);
      return rows;
    } catch (error: any) {
      throw new Error(`Error retrieving invoices: ${error.message}`);
    }
  };
  const getInvoiceReceiverInfoById = async ({ id }: { id: string }) => {
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
      FROM invoice_receiver_info_view
      where user_id = ? 
      and invoice_id = ?;
      `;
      const [rows, fields] = await connection.execute(query, [user_id, id]);

      connection.end();
      logger.log(query);
      return rows;
    } catch (error: any) {
      throw new Error(`Error retrieving invoices: ${error.message}`);
    }
  };

  const saveInvoice = async ({
    receiver_name,
    creation_date,
    street,
    city,
    state,
    zip,
    cart,
    services,
  }: any) => {
    console.log(
      receiver_name,
      creation_date,
      street,
      city,
      state,
      zip,
      cart,
      services
    );
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );
      await connection.beginTransaction();
      const invoiceQuery = `INSERT INTO invoice (user_id, creation_date) VALUES (?, ?)`;

      const [insertTable1]: any = await connection.execute(invoiceQuery, [
        user_id,
        creation_date,
      ]);
      logger.log(invoiceQuery);
      const lastPrimaryKey = insertTable1.insertId;

      const receiverInfoQuery =
        "INSERT INTO invoice_receiver_info (invoice_id, name, street, city, state, zip) VALUES (?, ?, ?, ?, ?, ?);";

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
        "INSERT INTO invoice_cart (invoice_id, description, quantity, price) VALUES (?, ?, ?, ?);";
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
        "INSERT INTO invoice_service (invoice_id, service_id) VALUES (?, ?);";
      logger.log(serviceQuery);
      await Promise.all(
        services.map((service_id: any) =>
          connection.execute(serviceQuery, [lastPrimaryKey, service_id])
        )
      );

      await connection.commit();

      await connection.end();

      return `Invoice ${lastPrimaryKey} saved successfully`;
    } catch (error: any) {
      throw new Error(`Error saving invoices: ${error.message}`);
    }
  };

  return {
    getAllInvoices,
    getInvoiceById,
    getInvoiceServicesById,
    getInvoiceCartById,
    saveInvoice,
    getInvoiceReceiverInfoById,
    getAllServices,
  };
};
