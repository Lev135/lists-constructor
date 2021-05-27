import { GlobalOptions } from "../compilation/options/global-options";
import { AccessMax } from "../services/access-service";
import { ListBlockCreate, ListBlockModel } from "./list-impl-types";
import { UserMin } from "../services/user-service";

// list/create (_, body) => send
export interface PostCreateBody {
    name : string,
    blocks : ListBlockCreate[],
    themeIds : number[],
    userNote ?: string
}
export interface PostCreateSend {
    id : number
}

// list/view (query, _) => send
export interface GetViewQuery {
    id : number
}
export interface GetViewSend {
    id: number,
    author: UserMin,
    name: string,
    themeIds: number[],
    creationDate: Date,
    blocks: ListBlockModel[]
    userNote ?: string,
    accessRules : AccessMax
}

// list/compile (query, body) => send
export interface PostCompileQuery {
    id : number
}
export type PostCompileBody = GlobalOptions;
export interface PostCompileSend {
    uuid : string
}
