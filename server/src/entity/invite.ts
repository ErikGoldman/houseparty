import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Connection } from "../db";
import { Houseparty } from "./houseparty";
import { User } from "./user";

@Entity()
export class Invite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Houseparty, party => party.invites)
  houseparty: Houseparty;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  save() {
    return Connection.manager.save(this);
  };
}