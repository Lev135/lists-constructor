import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToOne, JoinColumn } from "typeorm";
import { LatexField } from "../latex/latex-field";
import { Task } from "./task";

@Entity()
export class TaskSolution {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  index!: number;

  @OneToOne(type => LatexField, { nullable : false })
  @JoinColumn()
  body!: LatexField;

  @ManyToOne(type => Task, task => task.solutions)
  task!: Task;
}