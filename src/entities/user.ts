import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, ManyToMany, OneToMany } from 'typeorm';
import { Material } from './material/material';
import { UserNote } from './material/user-note';

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

  @OneToMany(type => Material, material => material.author)
  createdMaterials!: Material[];

  @OneToMany(type => UserNote, note => note.user)
  materialNotes!: UserNote[];
}