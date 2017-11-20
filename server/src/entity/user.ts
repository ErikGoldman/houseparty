import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { Connection } from "../db";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  googleId: string;

  @Column()
  displayName: string;

  @Column()
  email: string;

  static getById(userId: number) {
    return Connection.getRepository(User).findOneById(userId);
  }

  static getByGoogleId(googleId: string) {
    return Connection.getRepository(User).findOne({ googleId });
  }

  save() {
    return Connection.getRepository(User).save(this);
  };
}