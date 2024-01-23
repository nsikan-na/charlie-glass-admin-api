import express from "express";

import MessageResponse from "../../../interfaces/MessageResponse";
import { useLoginService } from "./LoginService";
import logger from "../../../util/logger";

const router = express.Router();

router.post<{}, MessageResponse>("/", async (req: any, res: any) => {
  const { username, password } = req.body;
  logger.log(req.body);
  const { login } = useLoginService();
  try {
    return res.send(await login({ username, password }));
  } catch (error) {
    logger.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
