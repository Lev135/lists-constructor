import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, Column } from "typeorm";
import { Access } from "../access";
import { User } from "../user";
import { Theme } from "./theme";
import { UserNote } from "./user-note";
import { Version } from "./version";

@Entity()
export class Material {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @CreateDateColumn()
  creationDate!: Date;

  @Column()
  accessId!: number

  @ManyToOne(type => User, user => user.createdMaterials)
  @JoinColumn({ name : 'userId' })
  author!: User;
  
  @OneToMany(type => UserNote, note => note.material)
  userNotes!: UserNote[];

  @ManyToMany(type => Theme)
  @JoinTable()
  themes!: Theme[];

  @OneToOne(type => Access)
  @JoinColumn({ name : 'accessId' })
  access!: Access;

  @OneToMany(type => Version, version => version.material)
  versions!: Version[];
}
