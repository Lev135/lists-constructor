import { ListMinImpl } from "./list-impl-types";

export interface TaskRemarkModel {
    type: string,
    label: string,
    body: string
}

export interface TaskSolutionModel {
    body : string,
    packageUuids : string[]
}

export interface TaskMinImpl {
    statement : string
}

export interface TaskMaxImpl extends TaskMinImpl {
    answer: string,
    solutions: TaskSolutionModel[],
    remarks: TaskRemarkModel[],
    packageUuids : string[]  
}

export interface TaskCreateImpl {
    statement: string,
    answer: string,
    solutions: TaskSolutionModel[],
    remarks: TaskRemarkModel[],
    packageUuids : string[]
}

export interface TaskCompImpl {
    uuid : string,
    statement : string
    answer: string,
    solutions: TaskSolutionModel[],
    packageUuids : string[]
}
