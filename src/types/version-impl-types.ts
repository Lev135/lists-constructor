import { AccessMax } from "../services/access-service";
import { UserMin } from "../services/user-service";
import { MaterialGetMaxImpl } from "./material-impl-types";

export interface VersionIds {
    uuid : string,
    materialId : number,
    index : number
}
export interface VersionGetMaxModel extends VersionIds {
    editor : UserMin,
    creationDate : Date,
    confirmed : boolean,
    confirmer ?: UserMin,
    confirmationDate ?: Date
}
export interface VersionListModel {
    materialId : number;
    versions : VersionGetMaxModel[];
}

export interface VersionalMinInfo {
    curVersion : VersionIds,

    material : MaterialGetMaxImpl
}

export interface VersionalMaxInfo {
    curVersionIds : VersionIds,
    versionList : VersionListModel,
    
    material : MaterialGetMaxImpl,
    access : AccessMax
}

