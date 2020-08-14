import { Entity, ManyToOne } from "typeorm";
import { MaterialBase } from "../material/material-base";
import { User } from "../user";
import { AccessType } from "./access-type";

@Entity()
export class MaterialUserAccess {
  @ManyToOne(type => MaterialBase, {primary: true})
  material!: MaterialBase;

  @ManyToOne(type => User, {primary: true})
  user!: User;

  @ManyToOne(type => AccessType, {primary: true})
  type!: AccessType;
}