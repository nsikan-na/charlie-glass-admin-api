import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import * as middlewares from "./middlewares/middlewares";
import QuoteController from "./api/v1/quote/QuoteController";
import MessageResponse from "./interfaces/MessageResponse";
import ReportController from "./api/v1/report/ReportController";
import logger from "./util/logger";
import verifyToken from "./middlewares/verifyToken";
import LoginController from "./api/v1/login/LoginController";

require("dotenv").config();

const port = process.env.PORT || 8080;
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
app.use("/api/v1/quotes", QuoteController);
app.use("/api/v1/reports", ReportController);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.listen(port, () => {
  logger.log(`Listening: http://localhost:${port}`);
});

export default app;
