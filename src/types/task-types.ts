import { LatexFieldGetModel, LatexFieldPostModel } from "../services/latex-service";
import { TaskRemarkModel } from "../services/task-service";
import { UserGetMinModel } from "../services/user-service";

// task/create (_, body) => send
export interface PostCreateBody {
    statement: LatexFieldPostModel,
    answer: string,
    solutions: LatexFieldPostModel[],
    remarks: TaskRemarkModel[],
    themeIds : number[],
    userNote? : string
}
export interface PostCreateSend {
    id : number
}

// tasl/view (query, _) => send
export interface GetViewQuery {
    id : number
}
export interface GetViewSend {
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
