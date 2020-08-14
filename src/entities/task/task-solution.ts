import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Task } from "./task";

@Entity()
export class TaskSolution {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  index!: number;

  @Column()
  body!: string;

  @Column()
  grade!: number;

  @ManyToOne(type => Task, task => task.solutions)
  task!: Task;
}