import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Task } from "./task";

@Entity()
export class TaskNote {
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

  @ManyToOne(type => Task, task => task.notes)
  task!: Task;
}