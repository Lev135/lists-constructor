import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Access } from "./access";
import { User } from "./user";

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
    
    /*
        Acess types:
        1 --- READ
        2 --- WRITE
        3 --- MODERATOR
    */
    @Column()
    type !: number;
}
