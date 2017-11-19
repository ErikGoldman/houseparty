// tslint:disable-next-line no-var-requires
require("source-map-support").install();

import * as express from "express";

import { Log } from "./logger";

process.on("unhandledRejection", (err: Error) => {
  Log.error(err.message, { stack: err.stack });
});

const port = process.env.PORT || 8080;

const app = express();
app.listen(port, (err: Error) => {
  if (err) {
    throw err;
  }

  Log.info(`server is listening on ${port}`);
});