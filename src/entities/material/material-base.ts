import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { User } from "../user";
import { MaterialVersion } from "./material-version";

@Entity()
export class MaterialBase {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => User, user => user.createdMaterials)
  author!: User;
  
  @OneToMany(type => MaterialVersion, version => version.base)
  versions!: MaterialVersion[];
}