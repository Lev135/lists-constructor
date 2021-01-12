import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "../user";

@Entity()
export class Material {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => User, user => user.createdMaterials)
  author!: User;

  @CreateDateColumn()
  creationDate!: Date;
}