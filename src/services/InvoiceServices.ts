import { useInvoiceRepo } from "../infra/InvoiceRepo";
import _ from "lodash";

export const useInvoiceService = ({ user_id }: { user_id: string }) => {
  const getAllInvoices = async () => {
    try {
      const { getAllInvoices } = useInvoiceRepo({ user_id });
      const invoices = await getAllInvoices();

      const output = _(invoices)
        .groupBy(["invoice_id", "user_id"])
        .map((invoices: any, invoice_id: any) => ({
          invoice_id: Number(invoice_id),
          ..._.omit(invoices[0], "service_id", "service_label"),
          services: invoices.map(({ service_id, service_label }: any) => ({
            service_id,
            service_label,
          })),
        }))
        .value();

      return output;
    } catch (error: any) {
      throw new Error(`Error retrieving invoices: ${error.message}`);
    }
  };

  const getInvoiceById = async ({ id }: { id: string }) => {
    try {
      const { getInvoiceById, getInvoiceCartById, getInvoiceServicesById } =
        useInvoiceRepo({ user_id });
      const invoice: any = await getInvoiceById({ id });
      if (invoice.length === 0) return {};
      const invoiceCart = await getInvoiceCartById({ id });
      const invoiceServices = await getInvoiceServicesById({ id });
      const output = invoice[0];
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
        date_of_invoice: new Date(),
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

  return { getAllInvoices, saveInvoice, getInvoiceById };
};
