import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Connection } from "../db";
import { Houseparty } from "./houseparty";
import { User } from "./user";

@Entity()
export class Invite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("bigint")
  date: number;

  @ManyToOne(type => Houseparty, party => party.invites)
  houseparty: Houseparty;

  @OneToOne(type => User, {
    eager: true,
  })
  @JoinColumn()
  user: User;

  static getById(reqUser: User | undefined, inviteId: number) {
    return Connection.getRepository(Invite).findOneById(inviteId, {
      relations: ["houseparty"],
    })
    .then((invite) => {
      if (!invite) {
        return invite;
      }

      if (!reqUser || (!reqUser.isAdmin() && reqUser.housepartyId !== invite.houseparty.id)) {
        throw new Error("permission error");
      }
      return invite;
    });
  }

  delete() {
    return Connection.getRepository(Invite).deleteById(this.id);
  }

  save() {
    return Connection.manager.save(this);
  };
}