import { Entity, OneToOne, Column, OneToMany, PrimaryColumn } from "typeorm";
import { TaskSolution } from "./task-solution";
import { TaskNote } from "./task-note";
import { MaterialChange } from "../material/material-change";

@Entity()
export class Task {
  @PrimaryColumn()
  materialId!: number;

  @OneToOne(type => MaterialChange, {primary: true})
  material!: MaterialChange;

  @Column()
  statement!: string;

  @Column()
  answer!: string;

  @OneToMany(type => TaskSolution, solution => solution.task)
  solutions!: TaskSolution[];
  
  @OneToMany(type => TaskNote, note => note.task)
  notes!: TaskNote[];
}