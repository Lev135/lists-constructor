import { LatexFieldCompModel, LatexFieldGetModel, LatexFieldPostModel } from "../services/latex-service";
import { ListMinImpl } from "./list-impl-types";

export interface TaskRemarkModel {
    type: string,
    label: string,
    body: string
}

export interface TaskMinImpl {
    id : number,
    statement : LatexFieldGetModel
}

export interface TaskMaxImpl extends TaskMinImpl {
    answer: string,
    solutions: LatexFieldGetModel[],
    remarks: TaskRemarkModel[],
    usedInLists: ListMinImpl[]  
}

export interface TaskCreateImpl {
    statement: LatexFieldPostModel,
    answer: string,
    solutions: LatexFieldPostModel[],
    remarks: TaskRemarkModel[],
}

export interface TaskCompImpl {
    id : number,
    statement : LatexFieldCompModel
    answer: string,
    solutions: LatexFieldCompModel[]
}
