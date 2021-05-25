import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Access } from "./access";
import { User } from "./user";

export enum AccessType {
    none = 0,
    read = 1,
    write = 2,
    moderate = 3,
    owner = 4
}

@Entity()
export class UserAccess {
    @PrimaryColumn()
    userId!: number;

    @PrimaryColumn()
    accessId!: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'userId' })
    user !: User;

    @ManyToOne(type => Access)
    @JoinColumn({ name: 'accessId'})
    access !: Access;
    
    @Column({ type : 'enum', enum : AccessType })
    type !: AccessType;
}
