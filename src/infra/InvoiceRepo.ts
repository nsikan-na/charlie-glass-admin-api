import * as mysql from "mysql2/promise";

export const useInvoiceRepo = () => {
  const getAllInvoices = async () => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );

      const [rows, fields] = await connection.execute(
        `
      SELECT 
      *
      FROM invoice_services_view
      where user_id = '1';
      `,
        [1]
      );

      connection.end();

      return rows;
    } catch (error: any) {
      throw new Error(`Error retrieving invoices: ${error.message}`);
    }
  };

  const getAllInvoiceCart = async () => {
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
      where invoice_id = '1';
      `,
        [1]
      );

      connection.end();

      return rows;
    } catch (error: any) {
      throw new Error(`Error retrieving invoices: ${error.message}`);
    }
  };

  const getAllInvoiceService = async () => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );

      const [rows, fields] = await connection.execute(
        `
      SELECT 
      service_id,
      label
      FROM invoice_services_view
      where invoice_id = '1';
      `,
        [1]
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
  return { getAllInvoices, getAllInvoiceService, getAllInvoiceCart };
};
