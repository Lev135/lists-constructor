import { Entity, OneToOne, Column, OneToMany, PrimaryColumn } from "typeorm";
import { Material } from "../material/material";
import { ListBlock } from "./list-block";

@Entity()
export class List {
  @PrimaryColumn()
  materialId!: number;

  @OneToOne(type => Material, {primary: true})
  material!: Material;

  @Column()
  name!: string;

  @OneToMany(type => ListBlock, block => block.list)
  blocks!: ListBlock[];
}