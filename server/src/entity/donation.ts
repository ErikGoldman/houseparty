import { Column, Entity, PrimaryColumn } from "typeorm";

import { Connection } from "../db";

@Entity()
export class Donation {
  @PrimaryColumn()
  nbId: string;

  @Column()
  amount: number;

  @Column({ nullable: true })
  email: string;

  @Column()
  name: string;

  static existsInDb(nbId: string) {
    return Connection.getRepository(Donation).findOne({ nbId })
    .then((donation) => {
      return donation !== undefined;
    });
  }

  static find(name: string, email:string): Promise<Donation[] | undefined> {
    return Connection.getRepository(Donation).find({ email: email.toLowerCase() })
    .then((emailDonation) => {
      return Connection.getRepository(Donation).find({ name: name.toLowerCase() })
      .then((nameDonation) => {
        const donationDedup: { [k: string]: Donation } = {};
        emailDonation.forEach((d) => donationDedup[d.nbId] = d);
        nameDonation.forEach((d) => donationDedup[d.nbId] = d);
        return Object.keys(donationDedup).map((k) => donationDedup[k]);
      });
    });
  }

  save() {
    return Connection.manager.save(this);
  };
}