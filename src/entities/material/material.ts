import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { User } from "../user";
import { Theme } from "./theme";
import { UserNote } from "./user-note";

@Entity()
export class Material {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => User, user => user.createdMaterials)
  author!: User;

  @CreateDateColumn()
  creationDate!: Date;

  @OneToMany(type => UserNote, note => note.material)
  userNotes!: UserNote[];

  @ManyToMany(type => Theme)
  @JoinTable()
  themes!: Theme[];
}