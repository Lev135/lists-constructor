import { Entity, OneToOne, Column, OneToMany, PrimaryColumn, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { LatexPackage } from "../latex/latex-package";
import { Version } from "../material/version";
import { ListBlock } from "./list-block";

@Entity()
export class List {
  @PrimaryColumn()
  uuid!: string;

  @Column()
  title!: string;

  @OneToMany(type => ListBlock, block => block.list)
  blocks!: ListBlock[];

  @ManyToMany(type => LatexPackage)
  @JoinTable()
  packages!: LatexPackage[];

  @OneToOne(type => Version, {primary: true})
  @JoinColumn({ name: 'uuid' })
  version!: Version;
}
