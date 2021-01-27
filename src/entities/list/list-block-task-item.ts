import { Entity, ManyToOne, Column, PrimaryColumn, JoinColumn } from "typeorm";
import { ListBlock } from "./list-block";
import { ListBlockTasks } from "./list-block-tasks";
import { Task } from "../task/task";

@Entity()
export class ListBlockTaskItem {
  @PrimaryColumn()
  id!: number;

  @ManyToOne(type => ListBlockTasks, block => block.taskItems, {primary: true})
  @JoinColumn({name: 'id'})
  block!: ListBlockTasks;

  @ManyToOne(type => Task)
  task!: Task;

  @PrimaryColumn()
  index!: number;
}