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
      order by date_of_invoice DESC;
      `,
        [user_id]
      );

      connection.end();

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

  const saveInvoice = async () => {
    try {
      // const connection = await mysql.createConnection(
      //   process.env.DATABASE_URL || ""
      // );
      // const [rows, fields] = await connection.execute(
      //   "SELECT * FROM invoice_cart_view WHERE invoice_id = ?",
      //   [1]
      // );
      // connection.end();
      // return rows;
    } catch (error: any) {
      throw new Error(`Error saving invoices: ${error.message}`);
    }
  };

  return {
    getAllInvoices,
    getInvoiceById,
    getInvoiceServicesById,
    getInvoiceCartById,
  };
};
