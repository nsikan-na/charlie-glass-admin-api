import app from "./app";

const port = process.env.PORT || 8080;
const logger = console;
app.listen(port, () => {
  /* eslint-disable no-console */
  logger.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
