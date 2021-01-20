import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";

@Entity()
@Tree("nested-set")
export class Theme {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @TreeChildren()
    subThemes!: Theme[];

    @TreeParent()
    parentTheme?: Theme;
}