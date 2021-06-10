import { LatexFieldCompModel, LatexFieldGetModel, LatexFieldPostModel } from "../services/latex-service";
import { TaskComp, TaskMin } from "../services/task-service";

// Create types

export interface ListBlockCommentCreate {
    body : LatexFieldPostModel
}
export interface ListBlockTasksCreate {
    taskUuids : string[]
}
export type  ListBlockCreate = ListBlockCommentCreate | ListBlockTasksCreate;
export interface ListCreateImpl {
    title : string,
    blocks : ListBlockCreate[],
};

// Get types

export interface ListMinImpl {
    title: string,
}
export interface ListBlockCommentModel {
    body : LatexFieldGetModel
}
export interface ListBlockTasksModel {
    tasks: TaskMin[]
}
export type ListBlockModel = ListBlockCommentModel | ListBlockTasksModel;
export interface ListMaxImpl extends ListMinImpl{
    blocks: ListBlockModel[]
}

// Comp types

export interface ListBlockTasksComp {
    tasks: TaskComp[]
}
export interface ListBlockCommentComp {
    body : LatexFieldCompModel
}
export type ListBlockComp = ListBlockCommentComp | ListBlockTasksComp;
export interface ListComplImpl extends ListMinImpl {
    blocks: ListBlockComp[]
}
