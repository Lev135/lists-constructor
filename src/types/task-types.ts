import { LatexFieldGetModel, LatexFieldPostModel } from "../services/latex-service";
import { TaskGetMaxModel, TaskPostCreateModel, TaskRemarkModel } from "../services/task-service";
import { UserGetMinModel } from "../services/user-service";

export interface PostCreateBody {
    statement: LatexFieldPostModel,
    answer: string,
    solutions: LatexFieldPostModel[],
    remarks: TaskRemarkModel[],
    themeIds : number[],
    userNote? : string
}

export interface SendPostCreate {
    id : number
}

export interface GetViewPageQuery {
    id : number
}

export interface RenderViewPage {
    id : number,
    author: UserGetMinModel,
    statement : LatexFieldGetModel,
    themeIds : number[],
    creationDate: Date,
    answer: string,
    solutions: LatexFieldGetModel[],
    remarks: TaskRemarkModel[]
    userNote ?: string
}

