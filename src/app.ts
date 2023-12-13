import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import * as middlewares from "./api/v1/middlewares/middlewares";
import InvoiceController from "./api/v1/controller/InvoiceController";
import MessageResponse from "./api/v1/interfaces/MessageResponse";

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

app.use("/api/v1/invoices", InvoiceController);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
