import { TaskComp, TaskMin } from "../services/task-service";

// Create types

export interface ListBlockCommentCreate {
    body : string
}
export interface ListBlockTasksCreate {
    taskUuids : string[]
}
export type  ListBlockCreate = ListBlockCommentCreate | ListBlockTasksCreate;
export interface ListCreateImpl {
    title : string,
    blocks : ListBlockCreate[],
    packageUuids : string[]
};

// Get types

export interface ListMinImpl {
    title: string,
}
export interface ListBlockCommentModel {
    body : string
}
export interface ListBlockTasksModel {
    tasks: TaskMin[]
}
export type ListBlockModel = ListBlockCommentModel | ListBlockTasksModel;
export interface ListMaxImpl extends ListMinImpl{
    blocks: ListBlockModel[]
    packageUuids : string[]
}

// Comp types

export interface ListBlockTasksComp {
    tasks: TaskComp[]
}
export interface ListBlockCommentComp {
    body : string
}
export type ListBlockComp = ListBlockCommentComp | ListBlockTasksComp;
export interface ListComplImpl extends ListMinImpl {
    blocks: ListBlockComp[],
    packageUuids : string[]
}
