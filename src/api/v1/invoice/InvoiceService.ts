import ValidationError from "../../../interfaces/errors/ValidationError";
import { useInvoiceRepo } from "./InvoiceRepo";
import _ from "lodash";

export const useInvoiceService = ({ user_id }: { user_id: string }) => {
  const getAllInvoices = async ({
    name,
    invoice_id,
    fromDate,
    toDate,
    page,
    pageSize,
    isSigned,
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
        isSigned,
      });
      return queryResult.map((invoice: any) => ({
        ...invoice,
        services: invoice?.services?.split(","),
      }));
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  const getInvoiceById = async ({ id }: { id: string }) => {
    try {
      const {
        getInvoiceById,
        getInvoiceItemsById,
        getInvoiceServicesById,
        getInvoiceReceiverInfoById,
      } = useInvoiceRepo({ user_id });
      const invoice: any = await getInvoiceById({ id });
      if (invoice.length === 0) return {};
      const invoiceItems = await getInvoiceItemsById({ id });
      const invoiceServices = await getInvoiceServicesById({ id });
      const invoiceReceiverInfo: any = await getInvoiceReceiverInfoById({ id });
      const output = { ...invoice[0], ...invoiceReceiverInfo[0] };
      output.items = invoiceItems;
      output.services = invoiceServices;
      return output;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  const saveInvoice: any = async ({
    receiver_name,
    street,
    city,
    state,
    zip,
    items,
    services,
  }: any) => {
    const { saveInvoice } = useInvoiceRepo({ user_id });
    if (!receiver_name) {
      throw new ValidationError("Please enter a valid name.");
    }
    if (!street) {
      throw new ValidationError("Please enter a valid street.");
    }

    if (!city) {
      throw new ValidationError("Please enter a valid city.");
    }

    if (!state) {
      throw new ValidationError("Please enter a valid state.");
    }

    if (!zip) {
      throw new ValidationError("Please enter a valid zip.");
    }

    if (!items || items?.length === 0) {
      throw new ValidationError("Please enter at least one valid item.");
    }

    if (!services || services?.length === 0) {
      throw new ValidationError("Please select at least one service.");
    }
    try {
      return await saveInvoice({
        receiver_name,
        creation_date: new Date(
          new Date().toLocaleDateString("en-US", {
            timeZone: "America/New_York",
          })
        )
          .toISOString()
          .split("T")[0],
        street,
        city,
        state,
        zip,
        items,
        services,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const getAllServices: any = async () => {
    const { getAllServices } = useInvoiceRepo({ user_id });
    try {
      return await getAllServices();
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  const signInvoice: any = async ({ id, expense, signature_date }: any) => {
    const { signInvoice } = useInvoiceRepo({ user_id });

    if (!signature_date) {
      throw new ValidationError("Please enter a valid signature date.");
    }
    if (!expense) {
      throw new ValidationError("Please enter a valid expense.");
    }
    const invoice = await getInvoiceById({ id });
    if (invoice?.isSigned) throw new ValidationError("Invoice already signed.");

    try {
      return await signInvoice({ id, expense, signature_date });
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  const resetInvoices: any = async () => {
    const { resetInvoices } = useInvoiceRepo({ user_id });
    try {
      return await resetInvoices();
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  return {
    getAllInvoices,
    saveInvoice,
    getInvoiceById,
    getAllServices,
    signInvoice,
    resetInvoices,
  };
};
