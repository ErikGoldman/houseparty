import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Connection } from "../db";
import { Invite } from "./invite";
import { User } from "./user";

@Entity()
export class Houseparty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @OneToMany(type => Invite, invite => invite.houseparty, {
    eager: true,
  })
  invites: Invite[];

  static getById(reqUser: User | undefined, housepartyId: number) {
    return Connection.getRepository(Houseparty).findOneById(housepartyId)
    .then((houseparty) => {
      if (!houseparty) {
        return houseparty;
      }

      if (!reqUser || (!reqUser.isAdmin && reqUser.housepartyId !== houseparty.id)) {
        throw new Error("Permission error");
      }

      return houseparty;
    });
  }

  save() {
    return Connection.manager.save(this);
  };
}