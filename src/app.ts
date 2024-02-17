import express from "express";
import cgiAdminRouter from "./cgi-admin";
require("dotenv").config();

const app = express();

app.get<{}, any>("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.use("/cgi-admin", cgiAdminRouter);

export default app;
