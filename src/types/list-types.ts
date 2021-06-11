import { GlobalOptions } from "../compilation/options/global-options";
import { ListCreateImpl, ListMaxImpl } from "./list-impl-types";
import { MaterialCreateImpl } from "./material-impl-types";
import { VersionalMaxInfo, VersionIds } from "./version-impl-types";

// list/create (_, body) => send
export interface PostCreateBody {
    list : ListCreateImpl
    material : MaterialCreateImpl
}
export type PostCreateSend = VersionIds;

// list/view (query, _) => send
export interface GetViewQuery {
    uuid : string
}
export interface GetViewSend extends VersionalMaxInfo {
    list : ListMaxImpl
}

// list/edit (query, body) => send
export interface PutEditQuery {
    uuid : string
}
export interface PutEditBody {
    list : ListCreateImpl
}
export type PutEditSend = VersionIds;

// list/compile (query, body) => send
export interface PostCompileQuery {
    uuid : string
}
export type PostCompileBody = GlobalOptions;
export interface PostCompileSend {
    uuid : string
}
