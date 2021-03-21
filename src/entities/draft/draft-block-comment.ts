import { Entity, Column, PrimaryColumn, JoinColumn, OneToOne } from "typeorm";
import { DraftBlock } from "./draft-block";

@Entity()
export class DraftBlockComment {
  @PrimaryColumn()
  id!: number;

  @OneToOne(type => DraftBlock, { primary : true, onDelete : 'CASCADE'})
  @JoinColumn({name : 'id'})
  block!: DraftBlock;

  @Column()
  body!: string;
}