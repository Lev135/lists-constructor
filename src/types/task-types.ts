import { TaskGetMaxModel, TaskPostCreateModel } from "../services/task-service";

export interface PostCreateBody {
    task : TaskPostCreateModel,
    userNote? : string
}

export interface SendPostCreate {
    id : number
}

export interface GetViewPageQuery {
    id : number
}

export interface RenderViewPage {
    task : TaskGetMaxModel,
    userNote ?: string
}

