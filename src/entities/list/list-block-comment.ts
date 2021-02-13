import { Entity, OneToOne, Column, PrimaryColumn, JoinColumn } from "typeorm";
import { LatexField } from "../latex/latex-field";
import { ListBlock } from "./list-block";

@Entity()
export class ListBlockComment {
  @PrimaryColumn()
  id!: number;
  
  @OneToOne(type => ListBlock, {primary: true})
  @JoinColumn({name: 'id'})
  listBlock!: ListBlock;

  @OneToOne(type => LatexField, { nullable : false })
  @JoinColumn()
  body!: LatexField;
}