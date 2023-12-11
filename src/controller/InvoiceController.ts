import express, { Request, Response } from "express";

import MessageResponse from "../interfaces/MessageResponse";
import { useInvoiceService } from "../services/InvoiceServices";

const router = express.Router();

router.get<{}, MessageResponse>(
  "/:user_id/",
  async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { getAllInvoices } = useInvoiceService({ user_id });
    try {
      return res.send(await getAllInvoices());
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

//get invoice by id
router.get<{}, MessageResponse>(
  "/:user_id/:id",
  async (req: Request, res: Response) => {
    const { user_id, id } = req.params;
    const { getInvoiceById } = useInvoiceService({ user_id });
    try {
      return res.send(await getInvoiceById({ id }));
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
    const { saveInvoice } = useInvoiceService({ user_id });
    try {
      return res.send(await saveInvoice(req.body));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
export default router;
