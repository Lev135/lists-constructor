import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { UserAccess } from "./user-access";

@Entity()
export class Access {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(type => UserAccess, userAcess => userAcess.access)
    usersAccess !: UserAccess[];

    @Column()
    ownerId !: number

    @ManyToOne(type => User)
    @JoinColumn({ name: 'ownerId' })
    owner !: User;
}
