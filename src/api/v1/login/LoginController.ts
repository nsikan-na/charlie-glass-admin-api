import express from "express";

import MessageResponse from "../../../interfaces/MessageResponse";
import { useLoginService } from "./LoginService";
import logger from "../../../util/logger";
import ValidationError from "../../../interfaces/errors/ValidationError";
import UnAuthError from "../../../interfaces/errors/UnAuthErrorr";

const router = express.Router();

router.post<{}, MessageResponse>("/", async (req: any, res: any) => {
  const { username, password } = req.body;
  logger.log(req.body);
  const { login } = useLoginService();
  try {
    return res.send({ content: await login({ username, password }) });
  } catch (error) {
    logger.log(error);
    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    if (error instanceof UnAuthError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
