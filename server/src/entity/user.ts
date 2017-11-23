import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { Connection } from "../db";
import { Houseparty } from "./houseparty";

const ADMINS = JSON.parse(process.env.ADMIN_EMAILS || "[\"erik.goldman@gmail.com\"]") as string[]

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hasSignedUp: boolean;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  givenName: string;

  @Column({ nullable: true })
  familyName: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  housepartyId: number;

  static getById(reqUser: User | undefined, userId: number, ignorePermission?: boolean) {
    if (!ignorePermission && !reqUser) {
      throw new Error("Permissons error");
    }
    return Connection.getRepository(User).findOneById(userId);
  }

  static getByEmail(reqUser: User | undefined, email: string, ignorePermission?: boolean) {
    if (!ignorePermission && !reqUser) {
      throw new Error("Permissons error");
    }
    return Connection.getRepository(User).findOne({ email });
  }

  static getByGoogleId(reqUser: User | undefined, googleId: string, ignorePermission?: boolean) {
    if (!ignorePermission && !reqUser) {
      throw new Error("Permissons error");
    }
    return Connection.getRepository(User).findOne({ where: { googleId }});
  }

  static getSignedUpUsers(reqUser: User | undefined) {
    if (!reqUser || !reqUser.isAdmin()) {
      throw new Error("Permissons error");
    }
    return Connection.getRepository(User).find({ where: { hasSignedUp: true, }});
  }

  isAdmin() {
    return ADMINS.find((u) => u === this.email) !== undefined;
  }

  getHouseparty(reqUser: User | undefined) {
    return Houseparty.getById(reqUser, this.housepartyId);
  }

  save() {
    return Connection.manager.save(this);
  };
}