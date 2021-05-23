import { keys } from "ts-transformer-keys";
import { createQueryBuilder, getRepository } from "typeorm";
import { Material } from "../entities/material/material";
import { Theme } from "../entities/material/theme";
import { UserNote } from "../entities/material/user-note";
import { User } from "../entities/user";
import { keysForSelection } from "../mlib";
import { AccessGetMaxModel, AccessType, createAccess, getAccessMax, hasAccess } from "./access-service";
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


async function checkMaterialAccess(materialId : number, userId : number, type: AccessType) : Promise<void> {
    const accessId = (await getMaterial(materialId)).accessId;
    if (!await hasAccess(accessId, userId, type))
        throw new Error("Недостаточно прав");
}

export async function getMaterialMin(id : number, userId : number) : Promise<MaterialGetMinModel> {
    await checkMaterialAccess(id, userId, AccessType.readAccess);
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

export async function createMaterial(obj : MaterialPostCreateModel) : Promise<number> {
    const author : User = await getUser(obj.authorId);
    const themes : Theme[] = await Promise.all(obj.themeIds.map(id => getTheme(id)));
    const accessId : number = await createAccess(author.id);
    
    const material = await getRepository(Material).save({ author, themes, accessId });
    setUserNote(material.id, obj.authorId, obj.userNote);
    return material.id;
}

function getMaterial(id : number) : Promise<Material> {
    return getRepository(Material).findOneOrFail(id);
}

export async function setUserNote(materialId : number, userId : number, note ?: string) : Promise<void> {
    if (note) {
        await getRepository(UserNote).save({
            materialId, userId, body: note
        });
    }
    else {
        await getRepository(UserNote).delete({
            materialId, userId
        });
    }
}

export async function getUserNote(materialId : number, userId?: number) : Promise<string | undefined> {
    if (userId === undefined)
        return;
    return (await getRepository(UserNote).findOne({ materialId, userId }))?.body;
}

export interface MaterialGetMaxModel extends MaterialGetMinModel {
    accessRules : AccessGetMaxModel
}

export async function getMaterialMax(materialId : number, userId : number) : Promise<MaterialGetMaxModel> {
    await checkMaterialAccess(materialId, userId, AccessType.readAccess);
    const accessId = (await getMaterial(materialId)).accessId;
    return {
        ...await getMaterialMin(materialId, userId),
        accessRules : await getAccessMax(accessId)
    }
}