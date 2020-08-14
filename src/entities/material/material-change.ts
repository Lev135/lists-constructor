import { Entity, PrimaryColumn, ManyToOne, OneToMany, Column, ManyToMany } from "typeorm";
import { MaterialVersion } from "./material-version";

@Entity()
export class MaterialChange {
  @PrimaryColumn()
  id!: number;

  @ManyToOne(type => MaterialVersion, materialBase => materialBase.changes,
    {primary: true})
  version!: MaterialVersion;

  @Column()
  index!: number;
}