import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, PrimaryColumn, JoinColumn } from "typeorm";
import { User } from "../user";
import { Material } from "./material";

@Entity()
export class UserNote {
  @PrimaryColumn()
  materialId!: number;

  @PrimaryColumn()
  userId!: number

  @Column()
  body!: string;

  @ManyToOne(type => Material, material => material.userNotes, { primary: true })
  @JoinColumn({ name : 'materialId' })
  material!: Material;

  @ManyToOne(type => User, user => user.materialNotes, { primary : true })
  @JoinColumn({ name : 'userId' })
  user!: User;
}