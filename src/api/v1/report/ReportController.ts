import express from "express";

import MessageResponse from "../../../interfaces/MessageResponse";
import { useReportService } from "./ReportService";

const router = express.Router();

router.get<{}, MessageResponse>("/profit", async (req: any, res: any) => {
  const { user_id } = req.user;
  const { fromDate, toDate } = req.query;
  const { getProfitData } = useReportService({ user_id });
  try {
    return res.send(await getProfitData({ fromDate, toDate }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get<{}, MessageResponse>("/services", async (req: any, res: any) => {
  const { user_id } = req.user;
  const { fromDate, toDate } = req.query;
  const { getServiceData } = useReportService({ user_id });
  try {
    return res.send(await getServiceData({ fromDate, toDate }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
