import { Entity, OneToOne, Column, OneToMany, PrimaryColumn, BaseEntity, JoinColumn, ManyToMany } from "typeorm";
import { TaskSolution } from "./task-solution";
import { TaskRemark } from "./task-remark";
import { LatexField } from "../latex/latex-field";
import { Version } from "../material/version";

@Entity()
export class Task {
  @PrimaryColumn('uuid')
  uuid!: string;

  @Column()
  statementId!: number;
  @Column()
  answer!: string;
  @OneToMany(type => TaskSolution, solution => solution.task)
  solutions!: TaskSolution[];
  @OneToMany(type => TaskRemark, note => note.task)
  remarks!: TaskRemark[];

  @OneToOne(type => LatexField, { nullable : false })
  @JoinColumn({ name : 'statementId' })
  statement!: LatexField;

  @OneToOne(type => Version, {primary: true})
  @JoinColumn({ name: 'uuid' })
  version!: Version;
}
