import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../user";
import { Material } from "./material";

@Entity()
@Unique(['materialId', 'index'])
export class Version {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;
  @Column()
  materialId!: number;
  @Column()
  index!: number;

  @Column({ nullable : false })
  editorId!: number;
  @CreateDateColumn({ nullable : false })
  creationDate!: Date;

  @Column({ default : false })
  confirmed!: boolean;
  @Column({ default : null })
  confirmerId!: number;
  @Column({ default : null })
  confirmationDate!: Date;

  @ManyToOne(type => User, user => user.createdMaterials)
  @JoinColumn({ name: 'editorId' })
  editor!: User;
  
  @ManyToOne(type => User, { nullable : true })
  @JoinColumn({ name : 'confirmerId' })
  confirmer!: User;

  @ManyToOne(type => Material, material => material.versions)
  @JoinColumn({ name: 'materialId' })
  material!: Material;
}
