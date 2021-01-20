import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Task } from "./task";

@Entity()
export class TaskRemark {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  index!: number;

  @Column()
  type!: string;

  @Column()
  label!: string;

  @Column()
  body!: string;

  @ManyToOne(type => Task, task => task.remarks)
  task!: Task;
}