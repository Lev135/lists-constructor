import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { LatexPackage } from "./latex-package";

@Entity()
export class LatexField {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length : 1000 })
    body!: string;

    @ManyToMany(type => LatexPackage)
    packages!: LatexPackage[];
}
