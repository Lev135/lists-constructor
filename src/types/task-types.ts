import { GlobalOptions } from "../compilation/options/global-options";
import { AccessMax } from "../services/access-service";
import { LatexFieldGetModel, LatexFieldPostModel } from "../services/latex-service";
import { UserMin } from "../services/user-service";
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
    id : number
}

// task/view (query, _) => send
export interface GetViewQuery {
    id : number
}
export interface GetViewSend {
    id : number,
    author: UserMin,
    statement : LatexFieldGetModel,
    themeIds : number[],
    creationDate: Date,
    answer: string,
    solutions: LatexFieldGetModel[],
    remarks: TaskRemarkModel[]
    userNote ?: string,
    accessRules : AccessMax
}

// task/compile (query, body) => send
export interface PostCompileQuery {
    id : number
}
export type PostCompileBody = GlobalOptions;
export interface PostCompileSend {
    uuid : string
}

// task/remarkTypes (_, _) => send
export type GetRemarkTypesSend = string[];