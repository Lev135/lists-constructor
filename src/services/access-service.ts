import { createQueryBuilder, getRepository } from "typeorm";
import { Access } from "../entities/access";
import { UserAccess } from "../entities/user-access";
import { getUserMin, UserGetMinModel } from "./user-service";

export enum AccessType {
    noneAccess = 0,
    readAccess = 1,
    writeAccess = 2,
    moderatorAccess = 3
}

export async function createAccess(ownerId : number) : Promise<number> {
    const accessObj = await getRepository(Access).save({ ownerId });
    await getRepository(UserAccess).save({
        accessId : accessObj.id,
        type : 3,
        userId : ownerId
    })
    return accessObj.id;
}

export async function hasAccess(accessId : number, userId : number, accessType : AccessType) : Promise<boolean> {
    return (await createQueryBuilder(UserAccess, 'userAccess')
        .where({ userId, accessId })
        .andWhere('userAccess.type >= :accessType', { accessType })
        .getCount()) > 0;
}

export async function addAccess(accessId : number, userId : number, accessType : AccessType, moderatorId : number) {
    if (!hasAccess(accessId, moderatorId, AccessType.moderatorAccess)
                || accessType === AccessType.moderatorAccess 
                    && !getRepository(Access).findOne({ id : accessId, ownerId : moderatorId})) {
        throw new Error("Недостаточно прав");
    }
    const access = await getRepository(UserAccess).findOne({ accessId, userId });
    if (access) {
        if (access.type >= accessType) {
            return;
        }
        else {
            access.type = accessType;
            await getRepository(UserAccess).save(access);
        }
    }
    else {
        await getRepository(UserAccess).save({
            accessId, userId, type : accessType
        });
    }
}

export interface AccessGetMaxModel {
    owner    : UserGetMinModel,
    read     : UserGetMinModel[],
    write    : UserGetMinModel[],
    moderate : UserGetMinModel[]
};

export async function getAccessMax(accessId : number) : Promise<AccessGetMaxModel> {
    const access = await getRepository(Access).findOneOrFail(accessId);
    const userAccess = await getRepository(UserAccess).find({ where: { accessId } });
    const read : UserAccess[] = [], 
          write : UserAccess[] = [],
          moderate : UserAccess[] = [];
    userAccess.forEach(userAccess => {
        switch (userAccess.type) {
        case AccessType.readAccess:
            read.push(userAccess);
            break;
        case AccessType.writeAccess:
            write.push(userAccess);
            break;
        case AccessType.moderatorAccess:
            moderate.push(userAccess);
            break;
        default:
            console.log("Unknown access type");
        }
    })
    return {
        owner : await getUserMin(access.ownerId),
        read : await Promise.all(read.map(a => getUserMin(a.userId))),
        write : await Promise.all(write.map(a => getUserMin(a.userId))),
        moderate : await Promise.all(moderate.map(a => getUserMin(a.userId)))
    }
}