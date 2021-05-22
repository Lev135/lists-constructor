import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Material } from "./material/material";

@Entity()
export class PdfIndex {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @ManyToOne(type => Material)
    compilable!: Material;

    @Column()
    templateName!: string;

    @Column({ length : 1000 })
    templateParsJSON!: string;
}
