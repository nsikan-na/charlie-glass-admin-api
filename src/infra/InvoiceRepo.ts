import * as mysql from "mysql2/promise";

export const getAllInvoices = async () => {
  try {
    const connection = await mysql.createConnection(
      process.env.DATABASE_URL || ""
    );

    const [rows, fields] = await connection.execute(
      "SELECT * FROM invoice_cart_view WHERE invoice_id = ?",
      [1]
    );

    connection.end();

    return rows;
  } catch (error: any) {
    throw new Error(`Error retrieving invoices: ${error.message}`);
  }
};
