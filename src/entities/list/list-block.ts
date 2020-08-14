import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { List } from "./list";

@Entity()
export class ListBlock {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  index!: number;

  @ManyToOne(type => List, list => list.blocks)
  list!: List;
}