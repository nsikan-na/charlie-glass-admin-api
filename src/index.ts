import app from "./app";
import logger from "./util/logger";

const port = process.env.PORT || 8080;
app.listen(port, () => {
  logger.log(`Listening: http://localhost:${port}`);
});
