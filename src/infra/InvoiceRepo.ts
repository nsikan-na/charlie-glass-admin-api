import * as mysql from "mysql2/promise";

export const useInvoiceRepo = ({ user_id }: { user_id: string }) => {
  // const pool = mysql.createPool({
  //   connectionLimit: 10, // Adjust as needed
  //   host: process.env.DB_HOST,
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_DATABASE,
  // });

  const getAllInvoices = async () => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );

      const [rows, fields] = await connection.execute(
        `
      SELECT *
      FROM invoice_service_view
      where user_id = ?
      order by invoice_creation_date DESC;
      `,
        [user_id]
      );

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

      const [rows, fields] = await connection.execute(
        `
      SELECT distinct id, label
      FROM service
      `,
        []
      );

      connection.end();
      console.log(rows);
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

      const [rows, fields] = await connection.execute(
        `
      SELECT *
      FROM invoice
      where user_id = ?
      and id = ?
      `,
        [user_id, id]
      );

      connection.end();

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

      const [rows, fields] = await connection.execute(
        `
      SELECT 
      cart_item_id, 
      description,
      quantity,
      price
      FROM invoice_cart_view
      where user_id = ?
      and invoice_id = ?;
      `,
        [user_id, id]
      );

      connection.end();

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

      const [rows, fields] = await connection.execute(
        `
      SELECT 
      service_id,
      service_label
      FROM invoice_service_view
      where user_id = ? 
      and invoice_id = ?;
      `,
        [user_id, id]
      );

      connection.end();

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

      const [rows, fields] = await connection.execute(
        `
      SELECT 
      receiver_name,
      receiver_street,
      receiver_city,
      receiver_state,
      receiver_zip
      FROM invoice_receiver_info_view
      where user_id = ? 
      and invoice_id = ?;
      `,
        [user_id, id]
      );

      connection.end();
      console.log(rows);
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

      const [insertTable1]: any = await connection.execute(
        "INSERT INTO invoice (user_id, creation_date) VALUES (?, ?);",
        [user_id, creation_date]
      );

      const lastPrimaryKey = insertTable1.insertId;

      await connection.execute(
        "INSERT INTO invoice_receiver_info (invoice_id, name, street, city, state, zip) VALUES (?, ?, ?, ?, ?, ?);",
        [lastPrimaryKey, receiver_name, street, city, state, zip]
      );

      const cartQuery =
        "INSERT INTO invoice_cart (invoice_id, description, quantity, price) VALUES (?, ?, ?, ?);";

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
