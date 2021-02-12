import { createQueryBuilder, getRepository } from "typeorm";
import { Material } from "../entities/material/material";
import { Theme } from "../entities/material/theme";
import { UserNote } from "../entities/material/user-note";
import { User } from "../entities/user";
import { getTheme } from "./theme-service";
import { getUser } from "./user-service";

export async function createMaterial(authorId : number, themeIds : number[]) : Promise<number> {
    const author : User = await getUser(authorId);
    const themes : Theme[] = await Promise.all(themeIds.map(id => getTheme(id)));
    return (await getRepository(Material).save({ author, themes })).id;
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

export async function getUserNote(materialId : number, userId : number) : Promise<string | undefined> {
    console.log('materialId', materialId);
    console.log('userId', userId);
    return (await createQueryBuilder(UserNote, 'note')
        .where('note.materialId = :materialId', { materialId })
        .andWhere('note.userId = :userId', { userId })
        .getOne())?.body;
}
