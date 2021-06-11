import { keys } from "ts-transformer-keys";
import { createQueryBuilder, getRepository } from "typeorm";
import { Material } from "../entities/material/material";
import { Theme } from "../entities/material/theme";
import { UserNote } from "../entities/material/user-note";
import { User } from "../entities/user";
import { AccessType } from "../entities/user-access";
import { keysForSelection } from "../mlib";
import { MaterialCreateImpl, MaterialGetMaxImpl } from "../types/material-impl-types";
import { AccessMax, accessLevel, checkAccessLevel, createAccess, getAccessMax, NonOwnerAccessType, setAccess } from "./access-service";
import { getTheme } from "./theme-service";
import { getUser, UserMin } from "./user-service";

export async function getMaterialMax(id : number, userId : number) : Promise<MaterialGetMaxImpl> {
    const material = await createQueryBuilder(Material, 'material')
        .where({id})
        .innerJoin('material.author', 'author')
            .addSelect(keysForSelection<User>('author', keys<UserMin>()))
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

export async function createMaterial(obj : MaterialCreateImpl, authorId : number) : Promise<number> {
    const author : User = await getUser(authorId);
    const themes : Theme[] = await Promise.all(obj.themeIds.map(id => getTheme(id)));
    const accessId : number = await createAccess(author.id);

    const material = await getRepository(Material).save({ author, themes, accessId });
    await setUserNote(material.id, authorId, obj.userNote);
    return material.id;
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

export async function getUserNote(materialId : number, userId: number) : Promise<string | undefined> {
    return getRepository(UserNote).findOne({ materialId, userId })
                .then(note => note?.body)
}

export async function getMaterialAccess(materialId : number) : Promise<AccessMax> {
    return getAccessId(materialId)
        .then(accessId => getAccessMax(accessId));
}

export async function setMaterialUserAccess(materialId : number,
                                accessType : NonOwnerAccessType, userId : number,
                                actorId : number) {
    return getAccessId(materialId)
        .then(accessId => setAccess(accessId, userId, accessType, actorId));
}

export async function materialAcessLevel(materialId : number,
                                         userId : number) : Promise<AccessType> {
    return getAccessId(materialId)
        .then(accessId => accessLevel(accessId, userId));
}

export async function materialCheckAccessLevel(materialId : number,
                                               userId : number,
                                               minLevel : AccessType) {
    return getAccessId(materialId)
        .then(accessId => checkAccessLevel(accessId, userId, minLevel));
}

// private methods implementation

async function getMaterial(id : number) : Promise<Material> {
    return getRepository(Material).findOneOrFail(id);
}

async function getAccessId(materialId : number) : Promise<number> {
    return getMaterial(materialId).then(mat => mat.accessId);
}
