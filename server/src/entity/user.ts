import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { Connection } from "../db";

const ADMINS = JSON.parse(process.env.ADMIN_EMAILS || "[\"erik.goldman@gmail.com\"]") as string[]

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isHost: boolean;

  @Column()
  googleId: string;

  @Column()
  displayName: string;

  @Column()
  givenName: string;

  @Column()
  familyName: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column()
  email: string;

  static getById(userId: number) {
    return Connection.getRepository(User).findOneById(userId);
  }

  static getByGoogleId(googleId: string) {
    return Connection.getRepository(User).findOne({ googleId });
  }

  static getPendingUsers() {
    return Connection.getRepository(User).find({ isHost: false });
  }

  static approveHost(userId: number) {
    return Connection.getRepository(User).findOneById(userId)
    .then((user) => {
      if (!user) {
        throw new Error("User not found");
      }

      user.isHost = true;
      return user.save();
    });
  }

  isAdmin() {
    return ADMINS.find((u) => u === this.email) !== undefined;
  }

  save() {
    return Connection.getRepository(User).save(this);
  };
}