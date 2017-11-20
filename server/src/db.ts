// tslint:disable-next-line no-var-requires
require("reflect-metadata");
import * as typeorm from "typeorm";

import { User } from "./entity/user";

export let Connection: typeorm.Connection;

export function Connect() {
  return typeorm.createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "postgres",
    entities: [
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