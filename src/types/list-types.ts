import { GlobalOptions } from "../compilation/options/global-options";
import { ListBlockPostModel, ListBlockGetModel } from "../services/list-service";
import { UserGetMinModel } from "../services/user-service";

export interface PostCreateBody {
    name : string,
    blocks : ListBlockPostModel[],
    themeIds : number[],
    userNote ?: string
}

export interface SendPostCreate {
    id : number
}

export interface GetViewPageQuery {
    id : number
}

export interface RenderViewPage {
    id: number,
    author: UserGetMinModel,
    name: string,
    themeIds: number[],
    creationDate: Date,
    blocks: ListBlockGetModel[]
    userNote ?: string
}

export interface PostCompileQuery {
    id : number
}

export type PostCompileBody = GlobalOptions;

export interface SendPostCompile {
    uuid : string
}

export interface GetViewPdfQuery {
    uuid : string
}

// SendViewPdf : .pdf file