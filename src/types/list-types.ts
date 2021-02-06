import { ListGetMaxModel, ListPostCreateModel } from "../services/list-service";

export interface PostCreateBody {
    list : ListPostCreateModel,
    userNote ?: string
}

export interface SendPostCreate {
    id : number
}

export interface GetViewPageQuery {
    id : number
}

export interface RenderViewPage {
    list : ListGetMaxModel,
    userNote ?: string
}