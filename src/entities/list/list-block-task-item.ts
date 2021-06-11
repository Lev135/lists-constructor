import { Entity, ManyToOne, Column, PrimaryColumn, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { ListBlockTasks } from "./list-block-tasks";
import { Task } from "../task/task";

@Entity()
export class ListBlockTaskItem {
  @PrimaryColumn()
  index!: number;

  @PrimaryColumn()
  blockId!: number;

  @Column()
  taskUuid!: string;

  @ManyToOne(type => Task)
  @JoinColumn({ name : 'taskUuid' })
  task!: Task;

  @ManyToOne(type => ListBlockTasks, block => block.taskItems)
  @JoinColumn({ name : 'blockId' })
  block!: ListBlockTasks;
}
