import { keys } from "ts-transformer-keys";
import { createQueryBuilder, getRepository } from "typeorm";
import { LatexField } from "../entities/latex/latex-field";
import { List } from "../entities/list/list";
import { Task } from "../entities/task/task";
import { TaskRemark } from "../entities/task/task-remark";
import { TaskSolution } from "../entities/task/task-solution";
import { keysForSelection, pick, sortByField } from "../mlib";
import { createLatexField, getLatexField, getLatexFieldComp, LatexFieldCompModel, LatexFieldGetModel, LatexFieldPostModel } from "./latex-service";
import { ListGetMinModel } from "./list-service";

export interface TaskGetMinModel {
    id : number,
    statement : LatexFieldGetModel
}

export interface TaskRemarkModel {
    type: string,
    label: string,
    body: string
}

export interface TaskGetMaxModel extends TaskGetMinModel {
    answer: string,
    solutions: LatexFieldGetModel[],
    remarks: TaskRemarkModel[],
    usedInLists: ListGetMinModel[]  
}

export interface TaskPostCreateModel {
    statement: LatexFieldPostModel,
    answer: string,
    solutions: LatexFieldPostModel[],
    remarks: TaskRemarkModel[],
}

export interface TaskCompModel {
    id : number,
    statement : LatexFieldCompModel
    answer: string,
    solutions: LatexFieldCompModel[]
}

async function addSolutions(solutionsObj : LatexFieldPostModel[], task : Task) : Promise<TaskSolution[]> {
    const bodies = await Promise.all(solutionsObj.map(createLatexField));
    const repo = getRepository(TaskSolution);
    return Promise.all(
        bodies.map((body, index) => repo.save({
            body, index, task
        }))
    );
}

async function addRemarks(remarksObj : TaskRemarkModel[], task : Task) : Promise<TaskRemark[]> {
    const repo = getRepository(TaskRemark);
    return Promise.all(
        remarksObj.map((obj, index) => repo.save({
            ...obj, task, index
        }))
    );
}

export async function createTask(materialId: number, obj: TaskPostCreateModel) : Promise<number> {
    const task : Task = await getRepository(Task).save({
        id : materialId,
        statement : await createLatexField(obj.statement),
        answer : obj.answer
    });

    await Promise.all([
        addSolutions(obj.solutions, task),
        addRemarks(obj.remarks, task),
    ]);
    return task.id;
}

export async function getTaskMin(id: number) : Promise<TaskGetMinModel> {
    const task : Task = await createQueryBuilder(Task, 'task')
        .where('task.id = :id', {id})
        .addSelect('task.statementId')
        .getOneOrFail();
    return {
        id : task.id,
        statement : await getLatexField(task.statementId)
    };
}

export async function getTaskUsedInLists(id: number) : Promise<ListGetMinModel[]> {
    const lists = await createQueryBuilder(List, 'list')
        .innerJoin('list.blocks', 'block')
        .innerJoin('block.blockTasks', 'blockTasks')
        .innerJoin('blockTasks.taskItems', 'item')
        .innerJoin('item.task', 'task')
        .where('task.id = :id', { id })
        .addSelect(keysForSelection<List>('list', keys<ListGetMinModel>()))
        .getMany();
    return lists.map(list => pick(list, keys<ListGetMinModel>()));
}

export async function getTaskMax(id: number) : Promise<TaskGetMaxModel> {
    const task : Task = await createQueryBuilder(Task, 'task')
        .where('task.id = :id', {id})
            .addSelect('task.statementId')
        .leftJoin('task.solutions', 'solution')
            .addSelect(keysForSelection<TaskSolution>('solution', ['index', 'bodyId']))
        .leftJoin('task.remarks', 'remark')
            .addSelect(keysForSelection<TaskRemark>('remark', keys<TaskRemarkModel>()))
        .getOneOrFail();
    sortByField(task.solutions, 'index');
    sortByField(task.remarks, 'index');
    return {
        id : task.id,
        statement : await getLatexField(task.statementId),
        answer : task.answer,
        solutions : await Promise.all(
                task.solutions.map(s => getLatexField(s.bodyId))
            ),
        remarks : task.remarks,
        usedInLists : await getTaskUsedInLists(task.id)
    };
}


export async function getTaskComp(id : number) : Promise<TaskCompModel> {
    const task : Task = await createQueryBuilder(Task, 'task')
        .where({ id })
        .innerJoin('task.statement', 'statement')
            .addSelect(keysForSelection<LatexField>('statement', ['id']))
        .leftJoin('task.solutions', 'solution')
            .addSelect(keysForSelection<TaskSolution>('solution', ['index', 'bodyId']))
        .leftJoin('task.remarks', 'remark')
            .addSelect(keysForSelection<TaskRemark>('remark', [...keys<TaskRemarkModel>(), 'index']))
        .getOneOrFail();
    sortByField(task.solutions, 'index');
    sortByField(task.remarks, 'index');
    return {
        id,
        statement : await getLatexFieldComp(task.statement.id),
        answer : task.answer,
        solutions : await Promise.all(
                task.solutions.map(s => getLatexFieldComp(s.bodyId))
            )
    }
}

export async function getRemarkTypes() : Promise<string[]> {
    const remarks =  await createQueryBuilder(TaskRemark, 'remark')
        .select(keysForSelection<TaskRemark>('remark', ['type']))
        .getMany();
    return remarks.map(remark => remark.type);
}
