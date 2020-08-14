import { Entity, ManyToOne, Column, PrimaryColumn } from "typeorm";
import { ListBlock } from "./list-block";
import { ListBlockTasks } from "./list-block-tasks";
import { Task } from "../task/task";

@Entity()
export class ListBlockTaskItem {
  @PrimaryColumn()
  blockId!: number;

  @ManyToOne(type => ListBlockTasks, block => block.taskItems, {primary: true})
  block!: ListBlockTasks;

  @ManyToOne(type => Task)
  task!: Task;

  @PrimaryColumn()
  index!: number;
}