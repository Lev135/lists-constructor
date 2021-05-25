import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Material } from "../material/material";

@Entity()
export class PdfIndex {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @Column()
    compilableId!: number;

    @ManyToOne(type => Material)
    @JoinColumn({ name : 'compilableId' })
    compilable!: Material;

    @Column()
    templateName!: string;

    @Column({ length : 1000 })
    templateParsJSON!: string;

    @Column({ default : false })
    processed!: boolean;

    @Column({ default : null })
    exitCode!: number;
}
