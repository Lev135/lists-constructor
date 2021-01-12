import { Entity, OneToOne, Column, OneToMany, PrimaryColumn } from "typeorm";
import { TaskSolution } from "./task-solution";
import { TaskNote } from "./task-note";
import { Material } from "../material/material";

@Entity()
export class Task {
  @PrimaryColumn()
  materialId!: number;

  @OneToOne(type => Material, {primary: true})
  material!: Material;

  @Column()
  statement!: string;

  @Column()
  answer!: string;

  @OneToMany(type => TaskSolution, solution => solution.task)
  solutions!: TaskSolution[];
  
  @OneToMany(type => TaskNote, note => note.task)
  notes!: TaskNote[];
}