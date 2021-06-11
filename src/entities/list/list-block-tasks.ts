import { Entity, OneToOne, OneToMany, PrimaryColumn, JoinColumn } from "typeorm";
import { ListBlock } from "./list-block";
import { ListBlockTaskItem } from "./list-block-task-item";

@Entity()
export class ListBlockTasks {
  @PrimaryColumn()
  id!: number;

  @OneToOne(type => ListBlock, {primary: true})
  @JoinColumn({name: 'id'})
  listBlock!: ListBlock;

  @OneToMany(type => ListBlockTaskItem, item => item.block)
  taskItems!: ListBlockTaskItem[];
}
