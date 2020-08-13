import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Column()
  name!: string;

  @Column()
  surname!: string;

  @Column({
    nullable: true
  })
  patronomyc?: string;

  @Column()
  password!: string;

  @Column({
    unique: true
  })
  email!: string;
  
  @CreateDateColumn()
  registrationDate!: Date;
}