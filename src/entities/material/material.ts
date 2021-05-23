import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, Column } from "typeorm";
import { Access } from "../access";
import { User } from "../user";
import { Theme } from "./theme";
import { UserNote } from "./user-note";

@Entity()
export class Material {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => User, user => user.createdMaterials)
  author!: User;

  @CreateDateColumn()
  creationDate!: Date;

  @OneToMany(type => UserNote, note => note.material)
  userNotes!: UserNote[];

  @ManyToMany(type => Theme)
  @JoinTable()
  themes!: Theme[];

  @Column()
  accessId!: number

  @OneToOne(type => Access)
  @JoinColumn({ name : 'accessId' })
  access!: Access;
}
