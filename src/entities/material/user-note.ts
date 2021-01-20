import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "../user";
import { Material } from "./material";

@Entity()
export class UserNote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  body!: string;

  @ManyToOne(type => Material, material => material.userNotes)
  material!: Material;

  @ManyToOne(type => User, user => user.materialNotes)
  author!: User;
}