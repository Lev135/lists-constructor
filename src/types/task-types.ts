import { GlobalOptions } from "../compilation/options/global-options";
import { AccessMax } from "../services/access-service";
import { UserMin } from "../services/user-service";
import { VersionIds, VersionListModel } from "../services/version-service";
import { TaskCreateImpl, TaskMaxImpl, TaskRemarkModel } from "./task-impl-types";

// task/create (_, body) => send
export interface PostCreateBody extends TaskCreateImpl {
    themeIds : number[],
    userNote? : string
}
export interface PostCreateSend {
    uuid : string,
    materialId : number,
    index : number
}

// task/view (query, _) => send
export interface GetViewQuery {
    uuid : string
}
export interface GetViewSend extends TaskMaxImpl {
    uuid : string,
    materialId : number,
    index : number,

    versionList : VersionListModel,

    author: UserMin,
    themeIds : number[],
    creationDate: Date,
    userNote ?: string,
    access : AccessMax
}

// task/edit (query, body) => send
export interface PutEditQuery {
    uuid : string
}
export interface PutEditBody extends TaskCreateImpl {
}
export interface PutEditSend extends VersionIds {
}


// task/compile (query, body) => send
export interface PostCompileQuery {
    uuid : string
}
export type PostCompileBody = GlobalOptions;
export interface PostCompileSend {
    uuid : string
}

// task/remarkTypes (_, _) => send
export type GetRemarkTypesSend = string[];
