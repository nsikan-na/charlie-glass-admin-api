import { useInvoiceRepo } from "../infra/InvoiceRepo";
import _ from "lodash";

export const useInvoiceService = () => {
  const getAllInvoices: any = async () => {
    try {
      const { getAllInvoices } = useInvoiceRepo();
      const invoices = await getAllInvoices();

      const output = _(invoices)
        .groupBy(["invoice_id", "user_id"])
        .map((invoices: any, invoice_id: any) => ({
          invoice_id: Number(invoice_id),
          ..._.omit(invoices[0], "service_id", "label"),
          services: invoices.map(({ service_id, label }: any) => ({
            service_id,
            label,
          })),
        }))
        .value();

      return output;
    } catch (error: any) {
      throw new Error(`Error retrieving invoices: ${error.message}`);
    }
  };

  const saveInvoice: any = async () => {
    try {
      return await saveInvoice();
    } catch (error: any) {
      throw new Error(`Error saving invoices: ${error.message}`);
    }
  };

  return { getAllInvoices, saveInvoice };
};
