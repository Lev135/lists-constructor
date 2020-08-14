import { Entity, OneToOne, Column, PrimaryColumn } from "typeorm";
import { ListBlock } from "./list-block";

@Entity()
export class ListBlockComment {
  @PrimaryColumn()
  listBlockId!: number;
  
  @OneToOne(type => ListBlock, {primary: true})
  listBlock!: ListBlock;

  @Column()
  body!: string;
}