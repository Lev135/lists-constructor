import { Entity, ManyToOne } from "typeorm";
import { Group } from "../group";
import { AccessType } from "./access-type";
import { MaterialBase } from "../material/material-base";

@Entity()
export class MaterialGroupAccess {
  @ManyToOne(type => MaterialBase, {primary: true})
  material!: MaterialBase;

  @ManyToOne(type => Group, {primary: true})
  group!: Group;

  @ManyToOne(type => AccessType, {primary: true})
  type!: AccessType;
}