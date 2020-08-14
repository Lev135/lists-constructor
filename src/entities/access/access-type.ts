import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class AccessType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({unique: true})
  name!: string;
}