import { GlobalOptions } from "../compilation/options/global-options";
import { ListMin } from "../services/list-service";
import { MaterialCreateImpl } from "./material-impl-types";
import { TaskCreateImpl, TaskMaxImpl } from "./task-impl-types";
import { VersionalMaxInfo, VersionIds } from "./version-impl-types";

// task/create (_, body) => send
export interface PostCreateBody {
    task: TaskCreateImpl
    material: MaterialCreateImpl
}
export type PostCreateSend = VersionIds;

// task/view (query, _) => send
export interface GetViewQuery {
    uuid : string
}
export interface GetViewSend extends VersionalMaxInfo {
    task : TaskMaxImpl,
    other : {
        usedInLists : ListMin[]
    }
}

// task/edit (query, body) => send
export interface PutEditQuery {
    uuid : string
}
export interface PutEditBody {
    task : TaskCreateImpl
}
export type PutEditSend = VersionIds;


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
