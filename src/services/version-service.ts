import { createQueryBuilder, getRepository } from "typeorm";
import { Version } from "../entities/material/version";
import { AccessType } from "../entities/user-access";
import { sortByField } from "../mlib";
import { AccessMax } from "./access-service";
import { createMaterial, getMaterialAccess, getMaterialMin, materialCheckAccessLevel, MaterialCreate, MaterialMin } from "./material-service";
import { getUserMin, UserMin } from "./user-service";

export interface VersionIds {
    uuid : string,
    materialId : number,
    index : number
}

export interface BaseCreateModel extends MaterialCreate {

}

export async function createBase(obj : BaseCreateModel) : Promise <VersionIds> {
    const materialId = await createMaterial(obj);
    const version = await getRepository(Version).save({
        editorId : obj.authorId,
        materialId,
        index : 0
    });
    return {
        uuid : version.uuid,
        materialId,
        index : version.index
    }
}

export async function createVersionCheck(uuid : string, actorId : number) {
    return versionCheckAccessLevel(uuid, actorId, AccessType.write);    
}
export async function createVersion(uuid : string, authorId : number) : Promise <VersionIds> {
    const materialId = await getVersionMaterialId(uuid);
    const obj = await createQueryBuilder(Version, 'version')
        .select("MAX(version.index)", 'lastIndex')
        .where({ materialId })
        .getRawOne();
    const lastIndex = obj ? obj.lastIndex : 0;
    const version = await getRepository(Version).save({
        authorId,
        materialId,
        index : lastIndex + 1
    });
    return {
        materialId,
        uuid : version.uuid,
        index : version.index
    };
}

export async function confirmVersionCheck(uuid : string, actorId : number) : Promise<void> {
    return versionCheckAccessLevel(uuid, actorId, AccessType.moderate);
}
export async function confirmVersion(uuid : string, confirmerId : number) : Promise<void>  {
    return getRepository(Version).update(uuid, {
        confirmed : true,
        confirmerId
    }).then();
}

interface VersionMinWithoutIds {
    editor : UserMin;
    creationDate : Date;
    confirmed : boolean;
    confirmer ?: UserMin;
    confirmationDate ?: Date;
}

export interface VersionGetMinModel extends VersionIds, VersionMinWithoutIds {    
}

export interface VersionGetMaxModel extends VersionGetMinModel {
    material : MaterialMin
}

export interface VersionListModel {
    materialId : number;
    versions : VersionMinWithoutIds[];
}

export async function getVersionMinCheck(uuid : string, actorId : number) {
    return versionCheckAccessLevel(uuid, actorId, AccessType.read);
}
export async function getVersionMin(uuid : string) : Promise<VersionGetMinModel> {
    return getRepository(Version).findOneOrFail(uuid).then(getVersionImpl);
}

export async function getVersionMaxCheck(uuid : string, actorId : number) {
    return versionCheckAccessLevel(uuid, actorId, AccessType.read);
}
export async function getVersionMax(uuid : string, userId : number) : Promise<VersionGetMaxModel> {
    return getVersionMin(uuid)
      .then(obj => getMaterialMin(obj.materialId, userId)
      .then(material => ({ ...obj, material })
    ));
}

export async function getVersionAccess(uuid : string) : Promise <AccessMax> {
    return getVersionMaterialId(uuid).then(getMaterialAccess)
}

export async function getVersionsListCheck(uuid : string, actorId : number) {
    return versionCheckAccessLevel(uuid, actorId, AccessType.read);
}
export async function getVersionsList(uuid: string) : Promise<VersionListModel> {
    const materialId = await getVersionMaterialId(uuid);
    const versions = await getRepository(Version).find({
        where : { materialId }
    });
    sortByField(versions, 'index');
    return {
        materialId,
        versions : await Promise.all(versions.map(getVersionWithoutIdsImpl))
    }
}


export async function versionCheckAccessLevel(uuid : string, userId : number, minLevel : AccessType) {
    return getRepository(Version).findOneOrFail(uuid)
        .then(version => materialCheckAccessLevel(version.materialId, userId, minLevel));
}

// private methods implementation

async function getVersionMaterialId(uuid : string) : Promise<number> {
    return getRepository(Version).findOneOrFail(uuid)
        .then(v => v.materialId);
}


async function getVersionWithoutIdsImpl(v : Version) : Promise<VersionMinWithoutIds> {
    return {
        editor : await getUserMin(v.editorId),
        creationDate : v.creationDate,
        confirmed : v.confirmed,
        confirmer : v.confirmed ? await getUserMin(v.confirmerId) : undefined,
        confirmationDate: v.confirmed ? v.confirmationDate : undefined
    }
}

async function getVersionImpl(v : Version) : Promise<VersionGetMinModel> {
    return {
        uuid : v.uuid,
        materialId : v.materialId,
        index : v.index,

        editor : await getUserMin(v.editorId),
        creationDate : v.creationDate,
        confirmed : v.confirmed,
        confirmer : v.confirmed ? await getUserMin(v.confirmerId) : undefined,
        confirmationDate: v.confirmed ? v.confirmationDate : undefined
    }
}
