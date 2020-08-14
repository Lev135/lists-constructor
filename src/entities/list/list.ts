import { Entity, OneToOne, Column, OneToMany, PrimaryColumn } from "typeorm";
import { MaterialChange } from "../material/material-change";
import { ListBlock } from "./list-block";

@Entity()
export class List {
  @PrimaryColumn()
  materialId!: number;

  @OneToOne(type => MaterialChange, {primary: true})
  material!: MaterialChange;

  @Column()
  name!: string;

  @OneToMany(type => ListBlock, block => block.list)
  blocks!: ListBlock[];
}