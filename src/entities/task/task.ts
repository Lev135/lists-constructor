import { Entity, OneToOne, Column, OneToMany, PrimaryColumn, BaseEntity, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { TaskSolution } from "./task-solution";
import { TaskRemark } from "./task-remark";
import { Version } from "../material/version";
import { LatexPackage } from "../latex/latex-package";

@Entity()
export class Task {
  @PrimaryColumn('uuid')
  uuid!: string;

  @Column()
  statement!: string;
  @Column()
  answer!: string;
  @OneToMany(type => TaskSolution, solution => solution.task)
  solutions!: TaskSolution[];
  @OneToMany(type => TaskRemark, note => note.task)
  remarks!: TaskRemark[];

  @ManyToMany(type => LatexPackage)
  @JoinTable()
  packages!: LatexPackage[];

  @OneToOne(type => Version, {primary: true})
  @JoinColumn({ name: 'uuid' })
  version!: Version;
}
