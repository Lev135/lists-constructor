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
    return {
        id : theme.id,
        name : theme.name,
        subThemes : sortByField(theme.subThemes.map(theme => getTree(theme)), 'name')
    };
}

export async function getThemeTrees() : Promise<ThemeGetTreeModel[]> {
    return sortByField(
        (await getTreeRepository(Theme).findTrees())
            .map(theme => getTree(theme)),
        'name');
}

async function createThemeTree(model : ThemePostCreateTreeModel) : Promise<Theme> {
    const children = await Promise.all(model.subThemes.map(theme => createThemeTree(theme)));
    const tree = getRepository(Theme).create({
        name : model.name,
        subThemes : children
    });
    return getRepository(Theme).save(tree);
}

export async function createThemeTrees(trees : ThemePostCreateTreeModel[]) {
    await Promise.all(trees.map(tree => createThemeTree(tree)));
}

export async function clearThemes() {
    await getRepository(Theme).delete({});
}

export function getTheme(id : number) : Promise<Theme> {
    return getRepository(Theme).findOneOrFail(id);
}