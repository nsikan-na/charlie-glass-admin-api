export const getAllInvoices: any = async () => {
  try {
    return await getAllInvoices();
  } catch (error: any) {
    throw new Error(`Error retrieving invoices: ${error.message}`);
  }
};
