import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToOne } from "typeorm";
import { Draft } from "./draft";

@Entity()
export class DraftBlock {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  index!: number;

  @ManyToOne(type => Draft, draft => draft.blocks)
  draft!: Draft;
}