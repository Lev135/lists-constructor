import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToOne, JoinColumn, JoinTable } from "typeorm";
import { LatexPackage } from "../latex/latex-package";
import { Task } from "./task";

@Entity()
export class TaskSolution {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  index!: number;

  @Column()
  body!: string;

  @ManyToMany(type => LatexPackage)
  @JoinTable()
  packages!: LatexPackage[];

  @ManyToOne(type => Task, task => task.solutions)
  task!: Task;
}