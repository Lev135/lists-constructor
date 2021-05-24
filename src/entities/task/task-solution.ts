import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToOne, JoinColumn } from "typeorm";
import { LatexField } from "../latex/latex-field";
import { Task } from "./task";

@Entity()
export class TaskSolution {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  index!: number;

  @Column()
  bodyId!: number;

  @OneToOne(type => LatexField, { nullable : false })
  @JoinColumn({ name : 'bodyId' })
  body!: LatexField;

  @ManyToOne(type => Task, task => task.solutions)
  task!: Task;
}