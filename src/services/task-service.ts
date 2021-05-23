import { keys } from "ts-transformer-keys";
import { createQueryBuilder, getRepository } from "typeorm";
import { LatexField } from "../entities/latex/latex-field";
import { List } from "../entities/list/list";
import { Task } from "../entities/task/task";
import { TaskRemark } from "../entities/task/task-remark";
import { TaskSolution } from "../entities/task/task-solution";
import { keysForSelection, pick, sortByField } from "../mlib";
import { createLatexField, getLatexFieldComp, LatexFieldCompModel, LatexFieldGetModel, LatexFieldPostModel } from "./latex-service";
import { ListGetMinModel } from "./list-service";
import { getMaterial } from "./material-service";

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
    const promises : Promise<TaskSolution>[] = [];
    for (let i : number = 0; i < solutionsObj.length; ++i) {
        promises.push(getRepository(TaskSolution).save({
            body : await createLatexField(solutionsObj[i]),
            index : i,
            task
        }));
    }
    return Promise.all(promises);
}

async function addRemarks(remarksObj : TaskRemarkModel[], task : Task) : Promise<TaskRemark[]> {
    const promises : Promise<TaskRemark>[] = [];
    const repo = getRepository(TaskRemark);
    for (let i : number = 0; i < remarksObj.length; ++i) {
        promises.push(repo.save({
            ...remarksObj[i],
            task,
            index : i
        }));
    }
    return Promise.all(promises);
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
    try {
        const task : Task = await createQueryBuilder(Task, 'task')
            .where('task.id = :id', {id})
            .innerJoin('task.statement', 'statement')
                .addSelect('statement.body')
            .getOneOrFail();
        console.log(task);
        return {
            id : task.id,
            statement : task.statement
        };
    }
    catch (err) {
        throw err;
    }
}

export async function getTaskUsedInLists(id: number) : Promise<ListGetMinModel[]> {
    const lists = await createQueryBuilder(List, 'list')
        .innerJoin('list.blocks', 'block')
            .addSelect('block.id')
        .innerJoin('block.blockTasks', 'blockTasks')
            .addSelect('blockTasks.id')
        .innerJoin('blockTasks.taskItems', 'item')
            .addSelect('item.id')
        .innerJoin('item.task', 'task')
            .addSelect('task.id')
        .where('task.id = :id', { id })
        .addSelect(keysForSelection<List>('list', keys<ListGetMinModel>()))
        .getMany();
    return lists.map(list => {
        return { id: list.id, name: list.name}
    });
}

export async function getTaskMax(id: number) : Promise<TaskGetMaxModel> {
    const task : Task = await createQueryBuilder(Task, 'task')
        .where('task.id = :id', {id})
        .innerJoin('task.statement', 'statement')
            .addSelect('statement.body')
        .leftJoin('task.solutions', 'solution')
            .addSelect(keysForSelection<TaskSolution>('solution', ['index']))
            .addOrderBy('solution.index')
        .leftJoin('solution.body', 'solution_body')
            .addSelect('solution_body.body')
        .leftJoin('task.remarks', 'remark')
            .addSelect(keysForSelection<TaskRemark>('remark', keys<TaskRemarkModel>()))
            .addOrderBy('remark.index')
        .getOneOrFail();
    return {
        id : task.id,
        statement : task.statement,
        answer : task.answer,
        solutions : sortByField(task.solutions, 'index').map(solution => solution.body),
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
            .addSelect(keysForSelection<TaskSolution>('solution', ['index']))
        .leftJoin('solution.body', 'solution_body')
            .addSelect('solution_body.id')
        .leftJoin('task.remarks', 'remark')
            .addSelect(keysForSelection<TaskRemark>('remark', [...keys<TaskRemarkModel>(), 'index']))
        .getOneOrFail();
    sortByField(task.solutions, 'index');
    sortByField(task.remarks, 'index');
    return {
        id,
        statement : await getLatexFieldComp(task.statement.id),
        answer : task.answer,
        solutions : await Promise.all(task.solutions.map(solution => getLatexFieldComp(solution.body.id)))
    }
}

export async function getRemarkTypes() : Promise<string[]> {
    const remarks =  await createQueryBuilder(TaskRemark, 'remark')
        .select(keysForSelection<TaskRemark>('remark', ['type']))
        .getMany();
    return remarks.map(remark => remark.type);
}
