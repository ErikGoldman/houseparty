import { Column, Entity, PrimaryColumn } from "typeorm";

import { Connection } from "../db";

@Entity()
export class Donation {
  @PrimaryColumn()
  nbId: string;

  @Column()
  amount: number;

  @Column({ nullable: true })
  email: string | null;

  @Column()
  name: string;

  static existsInDb(nbId: string) {
    return Connection.getRepository(Donation).findOne({ nbId })
    .then((donation) => {
      return donation !== undefined;
    });
  }

  static find(name: string, email:string): Promise<Donation | undefined> {
    return Connection.getRepository(Donation).findOne({ email })
    .then((emailDonation) => {
      if (emailDonation) {
        return emailDonation;
      }

      return Connection.getRepository(Donation).findOne({ name });
    });
  }

  save() {
    return Connection.manager.save(this);
  };
}