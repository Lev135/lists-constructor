import { createQueryBuilder, getRepository } from "typeorm";
import { Material } from "../entities/material/material";
import { UserNote } from "../entities/material/user-note";
import { User } from "../entities/user";

export async function setUserNote(materialId : number, userId : number, note : string) {
    const material = await getRepository(Material).findOneOrFail(materialId);
    const user = await getRepository(User).findOneOrFail(userId);
    await getRepository(UserNote).save({material, user, body: note});
}

export async function getUserNote(materialId : number, userId : number) : Promise<string | undefined> {
    return (await createQueryBuilder(UserNote, 'note')
        .where('note.materialId = :materialId', { materialId })
        .where('note.userId = :userId', { userId })
        .getOne())?.body;
}