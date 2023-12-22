import express, { Request, Response } from "express";

import MessageResponse from "../interfaces/MessageResponse";
import { useReportService } from "../services/ReportService";

const router = express.Router();

router.get<{}, MessageResponse>(
  "/:user_id/profit",
  async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { fromDate, toDate } = req.query;
    const { getProfitData } = useReportService({ user_id });
    try {
      return res.send(await getProfitData({ fromDate, toDate }));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get<{}, MessageResponse>(
  "/:user_id/services",
  async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { fromDate, toDate } = req.query;
    const { getServiceData } = useReportService({ user_id });
    try {
      return res.send(await getServiceData({ fromDate, toDate }));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
