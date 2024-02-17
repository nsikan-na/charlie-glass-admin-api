import express from "express";

import MessageResponse from "../../../interfaces/MessageResponse";
import { useInvoiceService } from "./InvoiceService";
import ValidationError from "../../../interfaces/errors/ValidationError";
import logger from "../../../util/logger";

const router = express.Router();

router.get<{}, MessageResponse>("/services", async (req: any, res: any) => {
  const { user_id } = req.user;
  const { getAllServices } = useInvoiceService({ user_id });
  try {
    return res.send({ content: await getAllServices() });
  } catch (error) {
    logger.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get<{}, MessageResponse>("/:id", async (req: any, res: any) => {
  const { user_id } = req.user;
  const { id } = req.params;
  logger.log(req.params);
  const { getInvoiceById } = useInvoiceService({ user_id });
  try {
    return res.send({ content: await getInvoiceById({ id }) });
  } catch (error) {
    logger.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get<{}, MessageResponse>("/", async (req: any, res: any) => {
  const { user_id } = req.user;
  const { name, invoice_id, fromDate, toDate, page, pageSize, isSigned } =
    req.query;
  logger.log(req.query);
  const { getAllInvoices } = useInvoiceService({ user_id });
  try {
    return res.send({
      content: await getAllInvoices({
        name,
        invoice_id,
        fromDate,
        toDate,
        page,
        pageSize,
        isSigned,
      }),
    });
  } catch (error) {
    logger.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post<{}, MessageResponse>("/add", async (req: any, res: any) => {
  const { user_id } = req.user;
  const { saveInvoice } = useInvoiceService({ user_id });
  try {
    return res.send({ message: await saveInvoice(req.body) });
  } catch (error) {
    logger.log(error);
    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post<{}, MessageResponse>("/:id/sign", async (req: any, res: any) => {
  const { user_id } = req.user;
  const { id } = req.params;
  logger.log(req.params);
  const { signInvoice } = useInvoiceService({ user_id });
  try {
    return res.send({ message: await signInvoice({ id, ...req.body }) });
  } catch (error) {
    logger.log(error);
    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post<{}, MessageResponse>("/reset", async (req: any, res: any) => {
  const { user_id } = req.user;
  const { resetInvoices } = useInvoiceService({ user_id });
  try {
    return res.send({ message: await resetInvoices() });
  } catch (error) {
    logger.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
