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

export default router;
