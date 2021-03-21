import { Entity, ManyToOne, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Task } from "../task/task";
import { DraftBlock } from "./draft-block";

@Entity()
export class DraftBlockTask {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(type => DraftBlock, { primary : true, onDelete : 'CASCADE'})
  @JoinColumn({ name : 'id' })
  block!: DraftBlock;

  @ManyToOne(type => Task)
  task!: Task;
}