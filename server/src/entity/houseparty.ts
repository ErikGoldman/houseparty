import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Connection } from "../db";
import { Invite } from "./invite";

@Entity()
export class Houseparty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @OneToMany(type => Invite, invite => invite.houseparty)
  invites: Invite[];

  static getById(housepartyId: number) {
    return Connection.getRepository(Houseparty).findOneById(housepartyId);
  }

  save() {
    return Connection.manager.save(this);
  };
}