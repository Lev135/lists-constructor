import { Entity, OneToOne, Column, OneToMany, PrimaryColumn, JoinColumn } from "typeorm";
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

  @OneToOne(type => Version, {primary: true})
  @JoinColumn({ name: 'uuid' })
  version!: Version;
}
