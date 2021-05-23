import { GlobalOptions } from "../compilation/options/global-options";
import { AccessGetMaxModel } from "../services/access-service";
import { ListBlockPostModel, ListBlockGetModel } from "../services/list-service";
import { UserGetMinModel } from "../services/user-service";

// list/create (_, body) => send
export interface PostCreateBody {
    name : string,
    blocks : ListBlockPostModel[],
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
    author: UserGetMinModel,
    name: string,
    themeIds: number[],
    creationDate: Date,
    blocks: ListBlockGetModel[]
    userNote ?: string,
    accessRules : AccessGetMaxModel
}

// list/compile (query, body) => send
export interface PostCompileQuery {
    id : number
}
export type PostCompileBody = GlobalOptions;
export interface PostCompileSend {
    uuid : string
}
