import { keys } from "ts-transformer-keys";
import { createQueryBuilder, getRepository } from "typeorm";
import { Material } from "../entities/material/material";
import { Theme } from "../entities/material/theme";
import { UserNote } from "../entities/material/user-note";
import { User } from "../entities/user";
import { keysForSelection } from "../mlib";
import { getTheme } from "./theme-service";
import { getUser, UserGetMinModel } from "./user-service";

export interface MaterialGetMinModel {
    author : UserGetMinModel,
    themeIds : number[],
    creationDate : Date,
    userNote?: string
}

export interface MaterialPostCreateModel {
    authorId : number,
    themeIds : number[],
    userNote?: string
}

export async function getMaterialMin(id : number, userId ?: number) : Promise<MaterialGetMinModel> {
    const material = await createQueryBuilder(Material, 'material')
        .where({id})
        .innerJoin('material.author', 'author')
            .addSelect(keysForSelection<User>('author', keys<UserGetMinModel>()))
        .leftJoin('material.themes', 'theme')
            .addSelect(keysForSelection<Theme>('theme', ['id']))
        .getOneOrFail();
    return {
        author : material.author,
        themeIds : material.themes.map(theme => theme.id),
        creationDate : material.creationDate,
        userNote : await getUserNote(id, userId)
    }
}

export async function createMaterial(obj : MaterialPostCreateModel, userId ?: number) : Promise<number> {
    const author : User = await getUser(obj.authorId);
    const themes : Theme[] = await Promise.all(obj.themeIds.map(id => getTheme(id)));
    const material = await getRepository(Material).save({ author, themes });
    if (userId !== undefined && obj.userNote)
        setUserNote(material.id, userId, obj.userNote);
    return material.id;
}

export function getMaterial(id : number) : Promise<Material> {
    return getRepository(Material).findOneOrFail(id);
}

export async function setUserNote(materialId : number, userId : number, note : string) {
    const material = await getRepository(Material).findOneOrFail(materialId);
    const user = await getRepository(User).findOneOrFail(userId);
    let noteObj = await getRepository(UserNote).findOne(undefined, {
        where : {
            material : material,
            user : user
        } 
    });
    if (!noteObj) {
        noteObj = getRepository(UserNote).create({
            material : material,
            user : user
        });
    }
    noteObj.body = note;
    await getRepository(UserNote).save(noteObj);
}

export async function getUserNote(materialId : number, userId?: number) : Promise<string | undefined> {
    if (userId === undefined)
        return;
    return (await createQueryBuilder(UserNote, 'note')
        .where('note.materialId = :materialId', { materialId })
        .andWhere('note.userId = :userId', { userId })
        .getOne())?.body;
}
