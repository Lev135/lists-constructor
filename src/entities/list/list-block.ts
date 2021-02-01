import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToOne } from "typeorm";
import { List } from "./list";
import { ListBlockComment } from "./list-block-comment";
import { ListBlockTasks } from "./list-block-tasks";

@Entity()
export class ListBlock {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  index!: number;

  @ManyToOne(type => List, list => list.blocks)
  list!: List;

  @OneToOne(type => ListBlockComment, blockComment => blockComment.listBlock)
  blockComment?: ListBlockComment;

  @OneToOne(type => ListBlockTasks, blockTasks => blockTasks.listBlock)
  blockTasks?: ListBlockTasks;
}