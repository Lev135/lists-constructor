import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LatexPackage {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @Column({ unique : true })
    name!: string;
}
