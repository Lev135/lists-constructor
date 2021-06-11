import { Entity, OneToOne, Column, PrimaryColumn, JoinColumn } from "typeorm";
import { ListBlock } from "./list-block";

@Entity()
export class ListBlockComment {
  @PrimaryColumn()
  id!: number;
  
  @OneToOne(type => ListBlock, {primary: true})
  @JoinColumn({name: 'id'})
  listBlock!: ListBlock;

  @Column()
  body!: string;
}
