import { Entity, OneToOne, OneToMany, PrimaryColumn } from "typeorm";
import { ListBlock } from "./list-block";
import { ListBlockTaskItem } from "./list-block-task-item";

@Entity()
export class ListBlockTasks {
  @PrimaryColumn()
  listBlockId!: number;

  @OneToOne(type => ListBlock, {primary: true})
  listBlock!: ListBlock;

  @OneToMany(type => ListBlockTaskItem, item => item.block)
  taskItems!: ListBlockTaskItem[];
}