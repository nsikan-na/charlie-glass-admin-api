import express from "express";

import MessageResponse from "../../../interfaces/MessageResponse";
import { useQuoteService } from "./QuoteService";

const router = express.Router();

router.get<{}, MessageResponse>("/services", async (req: any, res: any) => {
  const { user_id } = req.user;
  const { getAllServices } = useQuoteService({ user_id });
  try {
    return res.send(await getAllServices());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get<{}, MessageResponse>("/:id", async (req: any, res: any) => {
  const { user_id } = req.user;
  const { id } = req.params;
  const { getQuoteById } = useQuoteService({ user_id });
  try {
    return res.send(await getQuoteById({ id }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get<{}, MessageResponse>("/", async (req: any, res: any) => {
  const { user_id } = req.user;
  const { name, quote_id, fromDate, toDate, page, pageSize, isSigned } =
    req.query;
  const { getAllQuotes } = useQuoteService({ user_id });
  try {
    return res.send(
      await getAllQuotes({
        name,
        quote_id,
        fromDate,
        toDate,
        page,
        pageSize,
        isSigned,
      })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post<{}, MessageResponse>("/add", async (req: any, res: any) => {
  const { user_id } = req.user;
  const { saveQuote } = useQuoteService({ user_id });
  try {
    return res.send(await saveQuote(req.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post<{}, MessageResponse>("/:id/sign", async (req: any, res: any) => {
  const { user_id } = req.user;
  const { id } = req.params;
  const { signQuote } = useQuoteService({ user_id });
  try {
    return res.send(await signQuote({ id, ...req.body }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post<{}, MessageResponse>("/reset", async (req: any, res: any) => {
  const { user_id } = req.user;
  const { resetQuotes } = useQuoteService({ user_id });
  try {
    return res.send(await resetQuotes());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
