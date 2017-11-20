// tslint:disable-next-line no-var-requires
require("source-map-support").install();

import * as express from "express";
import * as expressSession from "express-session";
import * as _RedisStore from "connect-redis";
import * as passport from "passport";
import * as path from "path";

import * as graphqlHTTP from "express-graphql";

import { authenticationRouter } from "./auth";
import { Connect } from "./db";
import { GQLSchema } from "./graphql/schema";
import { Log } from "./logger";

const RedisStore = _RedisStore(expressSession);

process.on("unhandledRejection", (err: Error) => {
  Log.error(err.message, { stack: err.stack });
});

Connect()
.then((connection) => {
  const port = process.env.PORT || 8080;
  const app = express();

  app.use(expressSession({
    store: new RedisStore({
      disableTTL: true,
      host: "localhost",
      port: 6379,
    }),
    secret: process.env.SESSION_SECRET || "sessionSecret",
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/static", express.static((path.join(__dirname, "../../client/build"))));
  app.use("/auth", authenticationRouter);
  app.use('/graphql', graphqlHTTP({
    schema: GQLSchema,
    graphiql: true,
  }));

  app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "../../client/static", "index.html"));
  });

  app.listen(port, (err: Error) => {
    if (err) {
      throw err;
    }
    Log.info(`server is listening on ${port}`);
  });
})
.catch (error => Log.error(error));