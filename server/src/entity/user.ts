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

  static getById(userId: number) {
    return Connection.getRepository(User).findOneById(userId);
  }

  static getByGoogleId(googleId: string) {
    return Connection.getRepository(User).findOne({ where: { googleId }});
  }

  static getSignedUpUsers() {
    return Connection.getRepository(User).find({ where: { hasSignedUp: true, }});
  }

  isAdmin() {
    return ADMINS.find((u) => u === this.email) !== undefined;
  }

  getHouseparty() {
    return Houseparty.getById(this.housepartyId);
  }

  save() {
    return Connection.manager.save(this);
  };
}