import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, BaseEntity, ManyToMany, OneToMany } from 'typeorm';
import { MaterialBase } from './material/material-base';
import { Group } from './group';
import { MaterialUserAccess } from './access/material-user-access';
import { MaterialGroupAccess } from './access/material-group-access';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Column()
  name!: string;

  @Column()
  surname!: string;

  @Column({
    nullable: true
  })
  patronymic?: string;

  @Column()
  password!: string;

  @Column({
    unique: true
  })
  email!: string;
  
  @CreateDateColumn()
  registrationDate!: Date;

  @OneToMany(type => MaterialBase, materialBase => materialBase.author)
  createdMaterials!: MaterialBase[];
  
  @ManyToMany(type => Group, group => group.users)
  groups!: Group[];

  @OneToMany(type => MaterialUserAccess, rule => rule.user)
  rules!: MaterialUserAccess[];
}