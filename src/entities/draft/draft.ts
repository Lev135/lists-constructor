import { Entity, OneToOne, Column, OneToMany, PrimaryColumn, BaseEntity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user";
import { DraftBlock } from "./draft-block";

@Entity()
export class Draft {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({length : 40})
  name!: string;

  @ManyToOne(type => User, user => user.drafts)
  owner!: User;

  @OneToMany(type => DraftBlock, block => block.draft)
  blocks!: DraftBlock[];
}