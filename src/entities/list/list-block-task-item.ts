import { Entity, ManyToOne, Column, PrimaryColumn, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { ListBlock } from "./list-block";
import { ListBlockTasks } from "./list-block-tasks";
import { Task } from "../task/task";

@Entity()
export class ListBlockTaskItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => ListBlockTasks, block => block.taskItems)
  block!: ListBlockTasks;

  @ManyToOne(type => Task)
  task!: Task;

  @PrimaryColumn()
  index!: number;
}