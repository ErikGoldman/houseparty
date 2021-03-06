// tslint:disable-next-line no-var-requires
require("reflect-metadata");

import * as PostgressConnectionStringParser from 'pg-connection-string';
import * as typeorm from "typeorm";

import { User } from "./entity/user";
import { Invite } from "./entity/invite";
import { Houseparty } from "./entity/houseparty";
import { Donation } from "./entity/donation";

export let Connection: typeorm.Connection;

const connectionOptions = process.env.DATABASE_URL ? (
    PostgressConnectionStringParser.parse(process.env.DATABASE_URL as string)
  )
  :
  {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "password",
    database: "postgres",
  };

export function Connect() {
  return typeorm.createConnection({
    type: "postgres",
    host: connectionOptions.host as string,
    port: connectionOptions.port || 5432,
    username: connectionOptions.user as string,
    password: connectionOptions.password as string,
    database: connectionOptions.database as string,
    entities: [
      Donation,
      Houseparty,
      Invite,
      User,
    ],
    synchronize: true,
    logging: false
  })
  .then((connection) => {
    Connection = connection;
    return connection;
  });
}