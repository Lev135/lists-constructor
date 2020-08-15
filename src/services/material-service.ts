import { UserGetMinModel } from "./user-service";
import { GroupGetModel } from "./group-service";

export interface VersionTree {
  baseId: number;
  versions: {
    versionComment: string;
    implementedChanges: number[];
    changes: {
      changeComment: string;
    }
  }[]
}

export interface MaterialId {
  baseIds: number;
  versionId: number | "last" | null;
  changeId: number | "last" | null;
}

export interface AccessRulesPost {
  users: {
    userId: number;
    typeId: number;
  }[];
  groups: {
    groupId: number;
    typeId: number;
  };
}

export interface AccessRulesGet {
  users: {
    user: UserGetMinModel;
    typeId: number;
  }[];
  groups: {
    group: GroupGetModel;
    typeId: number;
  }
}

export async function getAccessRules(materialId: MaterialId) : Promise<AccessRulesGet> {
  throw new Error("Not implemented");
}
export async function setAccessRules(materialId: MaterialId, rules: AccessRulesPost) : Promise<void> {
  throw new Error("Not implemented");
}
export async function createMaterial() : Promise<MaterialId> {
  throw new Error("Not implemented");
}
export async function addVersion(materialId: MaterialId, implementedChanges: number[]) : Promise<MaterialId>{
  throw new Error("Not implemented");
}
export async function addChange(materialId: MaterialId) : Promise<MaterialId> {
  throw new Error("Not implemented");
}