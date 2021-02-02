import { TaskGetMaxModel, TaskPostCreateModel } from "../services/task-service";

export interface PostCreate {
    task : TaskPostCreateModel,
    userNote? : string
}

export interface SendPostCreate {
    id : number
}

export interface GetViewPage {
    id : number
}

export interface RenderViewPage {
    task : TaskGetMaxModel,
    userNote ?: string
}

