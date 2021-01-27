import { Entity, OneToOne, Column, OneToMany, PrimaryColumn, JoinColumn } from "typeorm";
import { Material } from "../material/material";
import { ListBlock } from "./list-block";

@Entity()
export class List {
  @PrimaryColumn()
  id!: number;

  @OneToOne(type => Material, {primary: true})
  @JoinColumn({ name: 'id' })
  material!: Material;

  @Column()
  name!: string;

  @OneToMany(type => ListBlock, block => block.list)
  blocks!: ListBlock[];
}