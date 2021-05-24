import { createQueryBuilder, getRepository } from "typeorm";
import { Access } from "../entities/access";
import { UserAccess } from "../entities/user-access";
import { keysForSelection } from "../mlib";
import { getUserMin, UserGetMinModel } from "./user-service";

export enum AccessType {
    none = 0,
    read = 1,
    write = 2,
    moderate = 3,
    owner = 4
}

export async function createAccess(ownerId : number) : Promise<number> {
    return getRepository(Access).save({ ownerId })
        .then(access => access.id)
}

async function isOwner(accessId : number, userId : number) : Promise<boolean> {
    return createQueryBuilder(Access, 'access')
        .where({ id: accessId, ownerId: userId })
        .getCount().then(c => c > 0);
}

export async function accessLevel(accessId : number, userId : number) : Promise<AccessType> {
    if (await isOwner(accessId, userId))
        return AccessType.owner;
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

export async function setAccess(accessId : number, userId : number, type : AccessType, actorId : number) {
    if (type < AccessType.none || type >= AccessType.owner)
        throw new Error("Некорректный тип " + type);
    
    let access = await getRepository(UserAccess).findOne({ accessId, userId });
    if (access?.type == AccessType.moderate || type == AccessType.moderate)
        checkAccessLevel(accessId, actorId, AccessType.owner);
    else
        checkAccessLevel(accessId, actorId, AccessType.moderate);
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

export interface AccessGetMaxModel {
    owner    : UserGetMinModel,
    read     : UserGetMinModel[],
    write    : UserGetMinModel[],
    moderate : UserGetMinModel[]
};

interface UserAccessType {
    user : UserGetMinModel,
    type : AccessType 
}

export async function getAccessMax(accessId : number) : Promise<AccessGetMaxModel> {
    const access = await getRepository(Access).findOneOrFail(accessId);
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
        owner : await getUserMin(access.ownerId),
        read : filterUsers(AccessType.read),
        write : filterUsers(AccessType.write),
        moderate : filterUsers(AccessType.moderate)
    }
}
