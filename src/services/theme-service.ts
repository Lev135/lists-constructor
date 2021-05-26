import { getRepository, getTreeRepository } from "typeorm";
import { Theme } from "../entities/material/theme";
import { sortByField } from "../mlib";

export interface ThemePostCreateTreeModel {
    name : string;
    subThemes : ThemePostCreateTreeModel[];        
}

export interface ThemeGetTreeModel extends ThemePostCreateTreeModel {
    id : number;
    name : string;
    subThemes : ThemeGetTreeModel[];
}

function getTree(theme : Theme) : ThemeGetTreeModel {
    const subThemes = theme.subThemes.map(getTree);
    sortByField(subThemes, 'name');
    return {
        id : theme.id,
        name : theme.name,
        subThemes
    };
}

export async function getThemeTrees() : Promise<ThemeGetTreeModel[]> {
    const themeTrees = (await getTreeRepository(Theme).findTrees()).map(getTree);
    sortByField(themeTrees, 'name');
    return themeTrees
}

async function createThemeTree(model : ThemePostCreateTreeModel) : Promise<Theme> {
    const children = await Promise.all(model.subThemes.map(createThemeTree));
    return getRepository(Theme).save({
        name : model.name,
        subThemes : children
    });
}

export async function createThemeTrees(trees : ThemePostCreateTreeModel[]) {
    await Promise.all(trees.map(createThemeTree));
}

export async function clearThemes() {
    await getRepository(Theme).delete({});
}

export function getTheme(id : number) : Promise<Theme> {
    return getRepository(Theme).findOneOrFail(id);
}
