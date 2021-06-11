import { createQueryBuilder, getRepository } from "typeorm";
import { Access } from "../entities/access";
import { AccessType, UserAccess } from "../entities/user-access";
import { keysForSelection } from "../mlib";
import { getUserMin, UserMin } from "./user-service";

export enum NonOwnerAccessType {
    none = 0,
    read = 1,
    write = 2,
    moderate = 3
}

export interface AccessMax {
    owner    : UserMin,
    read     : UserMin[],
    write    : UserMin[],
    moderate : UserMin[]
};


export async function createAccess(ownerId : number) : Promise<number> {
    const access = await  getRepository(Access).save({})
    await getRepository(UserAccess).save({
        access,
        type : AccessType.owner,
        userId : ownerId
    });
    return access.id;
}

export async function accessLevel(accessId : number, userId : number) : Promise<AccessType> {
    return createQueryBuilder(UserAccess, 'userAccess')
        .select(keysForSelection<UserAccess>('userAccess', ['type']))
        .where({ userId, accessId })
        .getOne()
        .then(user => user?.type || AccessType.none);
}

export async function checkAccessLevel(accessId : number, userId : number, minLevel : AccessType) {
    if (await accessLevel(accessId, userId) < minLevel)
        throw new Error("Недостаточно прав");
}

export async function setAccess(accessId : number, userId : number, nonOwnerType : NonOwnerAccessType, actorId : number) {
    const type : AccessType = nonOwnerType as number as AccessType;
    if (type < AccessType.none || type > AccessType.owner)
        throw new Error("Некорректный тип " + type);
    
    let access = await getRepository(UserAccess).findOne({ accessId, userId });
    
    if (access?.type == AccessType.owner || type == AccessType.owner)
        throw new Error("Передача прав владельца при помощи функции setAccess невозможна");

    if (access?.type == AccessType.moderate || type == AccessType.moderate)
        await checkAccessLevel(accessId, actorId, AccessType.owner);
    else
        await checkAccessLevel(accessId, actorId, AccessType.moderate);
    if (access) {
        if (type == AccessType.none)
            await getRepository(UserAccess).delete({ accessId, userId });
        else
            await getRepository(UserAccess).update({ accessId, userId }, { type });
    }
    else if (type > AccessType.none) {
        await getRepository(UserAccess).insert({ accessId, userId, type});
    }
}

interface UserAccessType {
    user : UserMin,
    type : AccessType 
}

export async function getAccessMax(accessId : number) : Promise<AccessMax> {
    const userAccess = await getRepository(UserAccess).find({ where: { accessId } });
    const infos = await Promise.all(
        userAccess.map(a =>  new Promise<UserAccessType>((res, rej) => {
            getUserMin(a.userId)
                .then(user => res({ user, type: a.type }))
                .catch(rej)
        }))
    );
    const filterUsers = (type : AccessType) =>
                infos.filter(info => info.type === type)
                     .map(info => info.user);
    return {
        owner : filterUsers(AccessType.owner)[0],
        read : filterUsers(AccessType.read),
        write : filterUsers(AccessType.write),
        moderate : filterUsers(AccessType.moderate)
    }
}
