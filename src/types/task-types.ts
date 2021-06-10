import { GlobalOptions } from "../compilation/options/global-options";
import { AccessMax } from "../services/access-service";
import { LatexFieldGetModel, LatexFieldPostModel } from "../services/latex-service";
import { UserMin } from "../services/user-service";
import { VersionListModel } from "../services/version-service";
import { TaskRemarkModel } from "./task-impl-types";

// task/create (_, body) => send
export interface PostCreateBody {
    statement: LatexFieldPostModel,
    answer: string,
    solutions: LatexFieldPostModel[],
    remarks: TaskRemarkModel[],
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
export interface GetViewSend {
    uuid : string,
    materialId : number,
    index : number,

    versionList : VersionListModel,

    author: UserMin,
    statement : LatexFieldGetModel,
    themeIds : number[],
    creationDate: Date,
    answer: string,
    solutions: LatexFieldGetModel[],
    remarks: TaskRemarkModel[]
    userNote ?: string,
    access : AccessMax
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

// task/edit (query, body) => send
export interface PutEditQuery {
    uuid : string
}
export interface PutEditBody {
    statement: LatexFieldPostModel,
    answer: string,
    solutions: LatexFieldPostModel[],
    remarks: TaskRemarkModel[],
    themeIds : number[],
    userNote? : string
}
export interface PutEditSend {
    index : number
}