import { ListGetMaxModel, ListPostCreateModel } from "../services/list-service";

export interface PostCreate {
    list : ListPostCreateModel,
    userNote ?: string
}

export interface SendPostCreate {
    id : number
}

export interface GetViewPage {
    id : number
}

export interface RenderViewPage {
    list : ListGetMaxModel,
    userNote ?: string
}