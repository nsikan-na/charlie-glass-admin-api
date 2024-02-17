import express from "express";
import MessageResponse from "./interfaces/MessageResponse";
import cgiAdminRouter from "./cgi-admin";
require("dotenv").config();

const app = express();

app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.use("/cgi-admin", cgiAdminRouter);

export default app;
