import { useQuoteRepo } from "../infra/QuoteRepo";
import _ from "lodash";

export const useQuoteService = ({ user_id }: { user_id: string }) => {
  const getAllQuotes = async ({
    name,
    quote_id,
    fromDate,
    toDate,
    page,
    pageSize,
    isSigned,
  }: any) => {
    try {
      const { getAllQuotes } = useQuoteRepo({ user_id });
      const queryResult: any = await getAllQuotes({
        name,
        quote_id,
        fromDate,
        toDate,
        page,
        pageSize,
        isSigned,
      });
      return queryResult.map((quote: any) => ({
        ...quote,
        quote_services: quote?.quote_services?.split(","),
      }));
    } catch (error: any) {
      throw new Error(`Error retrieving quotes: ${error.message}`);
    }
  };

  const getQuoteById = async ({ id }: { id: string }) => {
    try {
      const {
        getQuoteById,
        getQuoteItemsById,
        getQuoteServicesById,
        getQuoteReceiverInfoById,
      } = useQuoteRepo({ user_id });
      const quote: any = await getQuoteById({ id });
      if (quote.length === 0) return {};
      const quoteItems = await getQuoteItemsById({ id });
      const quoteServices = await getQuoteServicesById({ id });
      const quoteReceiverInfo: any = await getQuoteReceiverInfoById({ id });
      const output = { ...quote[0], ...quoteReceiverInfo[0] };
      output["items"] = quoteItems;
      output["services"] = quoteServices;
      return output;
    } catch (error: any) {
      throw new Error(`Error retrieving quotes: ${error.message}`);
    }
  };

  const saveQuote: any = async ({
    receiver_name,
    street,
    city,
    state,
    zip,
    cart,
    services,
  }: any) => {
    const { saveQuote } = useQuoteRepo({ user_id });
    try {
      const newQuoteId = await saveQuote({
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
        cart,
        services,
      });
      return getQuoteById({ id: newQuoteId });
    } catch (error: any) {
      throw new Error(`Error saving quotes: ${error.message}`);
    }
  };
  const getAllServices: any = async () => {
    const { getAllServices } = useQuoteRepo({ user_id });
    try {
      return await getAllServices();
    } catch (error: any) {
      throw new Error(`Error saving quotes: ${error.message}`);
    }
  };

  return { getAllQuotes, saveQuote, getQuoteById, getAllServices };
};