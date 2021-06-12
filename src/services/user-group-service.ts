import { createQueryBuilder, getRepository } from "typeorm";
import { AccessType } from "../entities/user-access";
import { UserGroup } from "../entities/user-group";
import { keysForSelection } from "../mlib";
import { accessLevel, AccessMax, checkAccessLevel, createAccess, getAccessMax, getAccessOwner, NonOwnerAccessType, setAccess } from "./access-service";
import { getUser, getUserMin, userCheckId, UserMin } from "./user-service";

export interface CreateGroupModel {
    name : string,
    userIds : [number]
}

export async function createGroupCheck(obj : CreateGroupModel) : Promise<void> {
    await Promise.all(
        obj.userIds.map(userCheckId)
    )
}
export async function createGroup(obj : CreateGroupModel, actorId : number) : Promise<string> {
    const accessId = await createAccess(actorId);
    const group = await getRepository(UserGroup).save({
        name : obj.name,
        accessId
    });
    await addUsersInGroup(group.uuid, obj.userIds);
    return group.uuid;
}

/**
 * @access read
 */
export async function isUserInGroup(uuid : string, userId : number) {
    return createQueryBuilder(UserGroup, 'group')
        .where({ uuid })
        .leftJoin('group.users', 'user')
            .andWhere('user.id = :userId', { userId } )
        .getOne()
        .then(group => group !== undefined)
}

export async function addUserInGroupCheck(uuid : string, userId : number, actorId : number) {
    if (await isUserInGroup(uuid, userId))
        throw new Error(`Пользователь ${userId} уже состоит в группе ${uuid}`);
    await groupCheckAccessLevel(uuid, actorId, AccessType.moderate);
    await userCheckId(userId);
}
export async function addUserInGroup(uuid : string, userId : number) : Promise<void> {
    return createQueryBuilder(UserGroup, 'group')
        .relation('users')
        .of(uuid)
        .add(userId);
}

export async function addUsersInGroupCheck(uuid : string, userIds : number[], actorId : number) : Promise<void> {
    await groupCheckAccessLevel(uuid, actorId, AccessType.moderate);
    await Promise.all(
        userIds.map(userId => addUserInGroupCheck(uuid, userId, actorId))
    )
}
export async function addUsersInGroup(uuid : string, userIds : number[]) : Promise<void> {
    await createQueryBuilder(UserGroup)
        .relation('users')
        .of(uuid)
        .add(userIds);
}

export async function removeUserFromGroupCheck(uuid : string, userId : number, actorId : number) {
    await groupCheckAccessLevel(uuid, actorId, AccessType.moderate);
    if (!await isUserInGroup(uuid, userId))
        throw new Error(`Пользователь ${userId} не состоит в группе ${uuid}`);
}
export async function removeUserFromGroup(uuid : string, userId : number) : Promise<void> {
    return createQueryBuilder(UserGroup)
        .relation('users')
        .of(uuid)
        .remove(userId);
}

/**
 * @access moderate
 */
export async function renameGroup(uuid : string, newName : string) : Promise<void> {
    return getRepository(UserGroup).update({
        uuid
    }, { name : newName}).then(_ => {});
}

/**
 * @access build-in
 */
export async function setGrouplUserAccess(uuid : string,
    accessType : NonOwnerAccessType, userId : number,
    actorId : number) {
    return getAccessId(uuid)
        .then(accessId => setAccess(accessId, userId, accessType, actorId));
}

/**
 * @access read
 */
export async function groupAcessLevel(uuid : string,
             userId : number) : Promise<AccessType> {
    return getAccessId(uuid)
        .then(accessId => accessLevel(accessId, userId));
}

export async function groupCheckAccessLevel(uuid : string,
                   userId : number,
                   minLevel : AccessType) {
    return getAccessId(uuid)
        .then(accessId => checkAccessLevel(accessId, userId, minLevel))
        .catch(err => { throw new Error(`Ошибка с группой ${uuid}: ${err.message}`) })
}

export interface GroupMin {
    uuid : string,
    name : string,
    owner : UserMin
}

/**
 * @access read
 */
export async function getGroupMin(uuid : string, actorId : number) : Promise<GroupMin> {
    const group = await getGroupEntity(uuid);
    const owner = await getAccessOwner(group.accessId);
    return {
        uuid,
        name : group.name,
        owner
    }
}

export interface GroupMax {
    uuid : string,
    name : string,
    creationDate : Date,
    users : UserMin[],
    access : AccessMax
}

/**
 * @access read
 */
 export async function getGroupMax(uuid : string) : Promise<GroupMax> {
    const group = await createQueryBuilder(UserGroup, 'group')
        .where({ uuid })
            .select(keysForSelection<UserGroup>('group', ['accessId', 'name', 'creationDate']))
        .leftJoin('group.users', 'user')
            .addSelect('user.id')
        .getOneOrFail();
    const users = await Promise.all(
        group.users.map(user => getUserMin(user.id))
    )
    const access = await getAccessMax(group.accessId);
    
    return {
        uuid,
        name : group.name,
        creationDate : group.creationDate,
        users,
        access
    }
}

export async function getGroupEntity(uuid : string) : Promise<UserGroup> {
    return getRepository(UserGroup).findOneOrFail(uuid)
        .catch(_ => { throw new Error(`Incorrect group id: ${uuid}`) });
}

// Private methods implementation

async function getAccessId(uuid : string) {
    return getGroupEntity(uuid).then(group => group.accessId);
}