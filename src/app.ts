import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import * as middlewares from "./middlewares/middlewares";
import QuoteController from "./api/v1/quote/QuoteController";
import MessageResponse from "./interfaces/MessageResponse";
import ReportController from "./api/v1/report/ReportController";
import verifyToken from "./middlewares/verifyToken";
import LoginController from "./api/v1/login/LoginController";

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.use("/api/v1/login", LoginController);
app.use("/api/v1/:user_id/quotes", verifyToken, QuoteController);
app.use("/api/v1/:user_id/reports", verifyToken, ReportController);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
