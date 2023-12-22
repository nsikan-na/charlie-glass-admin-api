import express from "express";

import MessageResponse from "../../../interfaces/MessageResponse";
import { useLoginService } from "./LoginService";

const router = express.Router();

router.post<{}, MessageResponse>("/", async (req: any, res: any) => {
  const { username, password } = req.body;
  const { login } = useLoginService();
  try {
    return res.send(await login({ username, password }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
