import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Material } from "../material/material";
import { Version } from "../material/version";

@Entity()
export class PdfIndex {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @Column()
    compilableUuid!: string;

    @ManyToOne(type => Version)
    @JoinColumn({ name : 'compilableId' })
    compilable!: Version;

    @Column()
    templateName!: string;

    @Column({ length : 1000 })
    templateParsJSON!: string;

    @Column({ default : false })
    processed!: boolean;

    @Column({ default : null })
    exitCode!: number;
}
