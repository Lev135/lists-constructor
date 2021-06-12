import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Access } from "./access";
import { User } from "./user";

@Entity()
export class UserGroup {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;
  
  @Column()
  name!: string;

  @CreateDateColumn()
  creationDate!: Date;

  @ManyToMany(type => User)
  @JoinTable()
  users!: User[];

  @Column()
  accessId!: number;

  @ManyToOne(type => Access)
  @JoinColumn({ name: 'accessId' })
  access!: Access;
}