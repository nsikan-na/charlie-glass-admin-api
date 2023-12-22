import express, { Request, Response } from "express";

import MessageResponse from "../interfaces/MessageResponse";
import { useQuoteService } from "../services/QuotesService";

const router = express.Router();

router.get<{}, MessageResponse>(
  "/:user_id/services",
  async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { getAllServices } = useQuoteService({ user_id });
    try {
      return res.send(await getAllServices());
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get<{}, MessageResponse>(
  "/:user_id/:id",
  async (req: Request, res: Response) => {
    const { user_id, id } = req.params;
    const { getQuoteById } = useQuoteService({ user_id });
    try {
      return res.send(await getQuoteById({ id }));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get<{}, MessageResponse>(
  "/:user_id",
  async (req: Request, res: Response) => {
    const { user_id } = req.params;
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
  }
);

router.post<{}, MessageResponse>(
  "/:user_id/add",
  async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { saveQuote } = useQuoteService({ user_id });
    try {
      return res.send(await saveQuote(req.body));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.patch<{}, MessageResponse>(
  "/:user_id/sign/:id",
  async (req: Request, res: Response) => {
    const { user_id, id } = req.params;
    const { signQuote } = useQuoteService({ user_id });
    try {
      return res.send(await signQuote({ id, ...req.body }));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
