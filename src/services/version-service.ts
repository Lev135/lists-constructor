import { createQueryBuilder, getRepository } from "typeorm";
import { Version } from "../entities/material/version";
import { AccessType } from "../entities/user-access";
import { sortByField } from "../mlib";
import { MaterialCreateImpl } from "../types/material-impl-types";
import { VersionalMaxInfo, VersionalMinInfo, VersionGetMaxModel, VersionIds, VersionListModel } from "../types/version-impl-types";
import { AccessMax } from "./access-service";
import { createMaterial, getMaterialAccess, getMaterialMax, materialCheckAccessLevel } from "./material-service";
import { getUserMin } from "./user-service";


export async function createBase(obj : MaterialCreateImpl, authorId : number) : Promise <VersionIds> {
    const materialId = await createMaterial(obj, authorId);
    const version = await getRepository(Version).save({
        editorId : authorId,
        materialId,
        index : 0
    });
    return {
        uuid : version.uuid,
        materialId,
        index : version.index
    }
}

// @access write
export async function createVersion(uuid : string, editorId : number) : Promise <VersionIds> {
    const materialId = await getVersionMaterialId(uuid);
    const obj = await createQueryBuilder(Version, 'version')
        .select("MAX(version.index)", 'lastIndex')
        .where({ materialId })
        .getRawOne();
    const lastIndex = obj ? obj.lastIndex : 0;
    const version = await getRepository(Version).save({
        editorId,
        materialId,
        index : lastIndex + 1
    });
    return {
        materialId,
        uuid : version.uuid,
        index : version.index
    };
}

// @access moderate
export async function confirmVersion(uuid : string, confirmerId : number) : Promise<void>  {
    const { confirmed } = await createQueryBuilder(Version, 'version')
        .where({ uuid })
        .select('confirmed')
        .getRawOne();
    if (confirmed)
        throw new Error(`Version ${uuid} is already confirmed`);
    return getRepository(Version).update(uuid, {
        confirmed : true,
        confirmerId,
        confirmationDate : new Date()
    }).then();
}

// @access read
export async function getVersionIds(uuid : string) : Promise<VersionIds> {
    return getRepository(Version).findOneOrFail(uuid).then(v => ({
        uuid : v.uuid,
        materialId : v.materialId,
        index : v.index
    }))
}

// @access read
export async function getVersionMax(uuid : string) : Promise<VersionGetMaxModel> {
    return getRepository(Version).findOneOrFail(uuid).then(getVersionImpl);
}

// @access read
export async function getVersionAccess(uuid : string) : Promise <AccessMax> {
    return getVersionMaterialId(uuid).then(getMaterialAccess)
}

// @access read
export async function getVersionsList(uuid: string) : Promise<VersionListModel> {
    const materialId = await getVersionMaterialId(uuid);
    const versions = await getRepository(Version).find({
        where : { materialId }
    });
    sortByField(versions, 'index');
    return {
        materialId,
        versions : await Promise.all(versions.map(getVersionImpl))
    }
}

// @access read
export async function getVersionalMinInfo(uuid : string, userId : number) : Promise<VersionalMinInfo> {
    const curVersion = await getVersionIds(uuid);
    const material = await getMaterialMax(curVersion.materialId, userId);

    return {
        curVersion,
        material
    }
}

// @access read
export async function getVersionalMaxInfo(uuid : string, userId : number) : Promise<VersionalMaxInfo> {
    const curVersionIds = await getVersionIds(uuid);
    const versionList = await getVersionsList(uuid);
    const material = await getMaterialMax(curVersionIds.materialId, userId);
    const access = await getMaterialAccess(curVersionIds.materialId);
    
    return {
        curVersionIds,
        versionList,
        material,
        access
    }
}

export async function versionCheckAccessLevel(uuid : string, userId : number, minLevel : AccessType) {
    return getVersion(uuid)
        .then(version => materialCheckAccessLevel(version.materialId, userId, minLevel))
        .catch(err => { throw new Error(`Ошибка с версией ${uuid}: ${err.message}`) });
}

// private methods implementation

async function getVersion(uuid : string) : Promise<Version> {
    return getRepository(Version)
        .findOneOrFail(uuid)
        .catch(_ => { throw new Error(`Incorrect version uuid: "${uuid}"`) })
}

async function getVersionMaterialId(uuid : string) : Promise<number> {
    return getRepository(Version).findOneOrFail(uuid)
        .then(v => v.materialId);
}

async function getVersionImpl(v : Version) : Promise<VersionGetMaxModel> {
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
