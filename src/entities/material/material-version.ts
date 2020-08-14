import { Entity, PrimaryColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Column } from "typeorm";
import { MaterialBase } from "./material-base";
import { MaterialChange } from "./material-change";

@Entity()
export class MaterialVersion {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => MaterialBase, materialBase => materialBase.versions)
  base!: MaterialBase;
  
  @OneToMany(type => MaterialChange, change => change.version)
  changes!: MaterialChange[];

  @Column()
  index!: number
}