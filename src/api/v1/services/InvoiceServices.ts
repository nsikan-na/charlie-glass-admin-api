import { useInvoiceRepo } from "../infra/InvoiceRepo";
import _ from "lodash";

export const useInvoiceService = ({ user_id }: { user_id: string }) => {
  const getAllInvoices = async ({
    name,
    invoice_id,
    fromDate,
    toDate,
    page,
    pageSize,
  }: any) => {
    try {
      const { getAllInvoices } = useInvoiceRepo({ user_id });
      const queryResult: any = await getAllInvoices({
        name,
        invoice_id,
        fromDate,
        toDate,
        page,
        pageSize,
      });
      return queryResult.map((invoice: any) => ({
        ...invoice,
        invoice_services: invoice?.invoice_services?.split(","),
      }));
    } catch (error: any) {
      throw new Error(`Error retrieving invoices: ${error.message}`);
    }
  };

  const getInvoiceById = async ({ id }: { id: string }) => {
    try {
      const {
        getInvoiceById,
        getInvoiceCartById,
        getInvoiceServicesById,
        getInvoiceReceiverInfoById,
      } = useInvoiceRepo({ user_id });
      const invoice: any = await getInvoiceById({ id });
      if (invoice.length === 0) return {};
      const invoiceCart = await getInvoiceCartById({ id });
      const invoiceServices = await getInvoiceServicesById({ id });
      const invoiceReceiverInfo: any = await getInvoiceReceiverInfoById({ id });
      const output = { ...invoice[0], ...invoiceReceiverInfo[0] };
      output["cart"] = invoiceCart;
      output["services"] = invoiceServices;
      return output;
    } catch (error: any) {
      throw new Error(`Error retrieving invoices: ${error.message}`);
    }
  };

  const saveInvoice: any = async ({
    receiver_name,
    street,
    city,
    state,
    zip,
    cart,
    services,
  }: any) => {
    const { saveInvoice } = useInvoiceRepo({ user_id });
    try {
      return await saveInvoice({
        receiver_name,
        creation_date: new Date(
          new Date().toLocaleDateString("en-US", {
            timeZone: "America/New_York",
          })
        )
          .toISOString()
          .split("T")[0]
          .split("T")[0],
        street,
        city,
        state,
        zip,
        cart,
        services,
      });
    } catch (error: any) {
      throw new Error(`Error saving invoices: ${error.message}`);
    }
  };
  const getAllServices: any = async () => {
    const { getAllServices } = useInvoiceRepo({ user_id });
    try {
      return await getAllServices();
    } catch (error: any) {
      throw new Error(`Error saving invoices: ${error.message}`);
    }
  };

  return { getAllInvoices, saveInvoice, getInvoiceById, getAllServices };
};
