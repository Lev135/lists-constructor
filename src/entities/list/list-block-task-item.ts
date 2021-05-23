import { Entity, ManyToOne, Column, PrimaryColumn, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { ListBlockTasks } from "./list-block-tasks";
import { Task } from "../task/task";

@Entity()
export class ListBlockTaskItem {
  @PrimaryColumn()
  blockId!: number;

  @ManyToOne(type => ListBlockTasks, block => block.taskItems)
  @JoinColumn({ name : 'blockId' })
  block!: ListBlockTasks;

  @Column()
  taskId!: number;

  @ManyToOne(type => Task)
  @JoinColumn({ name : 'taskId' })
  task!: Task;

  @PrimaryColumn()
  index!: number;
}