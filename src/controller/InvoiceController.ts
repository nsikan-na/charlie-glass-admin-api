import express, { Request, Response } from "express";

import MessageResponse from "../interfaces/MessageResponse";
import { useInvoiceService } from "../services/InvoiceServices";

const router = express.Router();

router.get<{}, MessageResponse>("/", async (req: Request, res: Response) => {
  const { getAllInvoices } = useInvoiceService();
  try {
    return res.send(await getAllInvoices());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post<{}, MessageResponse>(
  "/add",
  async (req: Request, res: Response) => {
    const { saveInvoice } = useInvoiceService();
    try {
      return res.send(await saveInvoice());
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
export default router;
