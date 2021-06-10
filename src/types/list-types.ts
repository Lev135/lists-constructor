import { GlobalOptions } from "../compilation/options/global-options";
import { AccessMax } from "../services/access-service";
import { ListBlockCreate, ListBlockModel } from "./list-impl-types";
import { UserMin } from "../services/user-service";
import { VersionIds } from "../services/version-service";

// list/create (_, body) => send
export interface PostCreateBody {
    title : string,
    blocks : ListBlockCreate[],
    themeIds : number[],
    userNote ?: string
}
export interface PostCreateSend extends VersionIds {
    
}

// list/view (query, _) => send
export interface GetViewQuery {
    uuid : string
}
export interface GetViewSend extends VersionIds {
    author: UserMin,
    title: string,
    themeIds: number[],
    creationDate: Date,
    blocks: ListBlockModel[]
    userNote ?: string,
    access : AccessMax
}

// list/compile (query, body) => send
export interface PostCompileQuery {
    uuid : string
}
export type PostCompileBody = GlobalOptions;
export interface PostCompileSend {
    uuid : string
}
