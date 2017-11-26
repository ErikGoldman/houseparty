import { Column, Entity, PrimaryColumn } from "typeorm";

import { Connection } from "../db";

@Entity()
export class Donation {
  @PrimaryColumn()
  nbId: string;

  @Column()
  amount: number;

  @Column()
  email: string;

  @Column()
  name: string;

  static existsInDb(nbId: string) {
    return Connection.getRepository(Donation).findOne({ nbId })
    .then((donation) => {
      return donation !== undefined;
    });
  }

  save() {
    return Connection.manager.save(this);
  };
}