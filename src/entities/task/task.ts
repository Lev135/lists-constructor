import { Entity, OneToOne, Column, OneToMany, PrimaryColumn, BaseEntity, JoinColumn, ManyToMany } from "typeorm";
import { TaskSolution } from "./task-solution";
import { TaskRemark } from "./task-remark";
import { Material } from "../material/material";
import { LatexField } from "../latex/latex-field";

@Entity()
export class Task {
  @PrimaryColumn()
  id!: number;

  @OneToOne(type => Material, {primary: true})
  @JoinColumn({name: 'id'})
  material!: Material;

  @Column()
  statementId!: number;

  @OneToOne(type => LatexField, { nullable : false })
  @JoinColumn({ name : 'statementId' })
  statement!: LatexField;

  @Column()
  answer!: string;

  @OneToMany(type => TaskSolution, solution => solution.task)
  solutions!: TaskSolution[];
  
  @OneToMany(type => TaskRemark, note => note.task)
  remarks!: TaskRemark[];
}