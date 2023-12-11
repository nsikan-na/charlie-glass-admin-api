import express, { Request, Response } from "express";

import MessageResponse from "../interfaces/MessageResponse";
import { getAllInvoices } from "../infra/InvoiceRepo";

const router = express.Router();

router.get<{}, MessageResponse>("/", async (req: Request, res: Response) => {
  try {
    return res.send(await getAllInvoices());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
export default router;
