import * as mysql from "mysql2/promise"; // Import the promise-based version

export const getAllInvoices: any = async () => {
  try {
    return await getAllInvoices();
  } catch (error: any) {
    throw new Error(`Error retrieving invoices: ${error.message}`);
  }
};
