import { keys } from "ts-transformer-keys";
import { createQueryBuilder, getRepository } from "typeorm";
import { Material } from "../entities/material/material";
import { Task } from "../entities/task/task";
import { TaskRemark } from "../entities/task/task-remark";
import { TaskSolution } from "../entities/task/task-solution";
import { User } from "../entities/user";
import { keysForSelection, pick, sortByField } from "../mlib";
import { UserGetMinModel } from "./user-service";

export interface TaskGetMinModel {
    id : number,
    author: UserGetMinModel,
    statement : string,
    themeIds : number[]
}

export interface TaskSolutionModel {
    body: string,
    grade: number
}

export interface TaskRemarkModel {
    type: string,
    label: string,
    body: string
}

export interface TaskGetMaxModel extends TaskGetMinModel {
    creationDate: Date,
    answer: string,
    solutions: TaskSolutionModel[],
    remarks: TaskRemarkModel[]  
}

export interface TaskPostCreateModel {
    // authorId не добавляем, так как автора будем добавлять в controller'e отдельно,
    // а всё остальное будет приходить JSON'ом с front end'a
    statement: string,
    answer: string,
    solutions: TaskSolutionModel[],
    remarks: TaskRemarkModel[],
    themeIds : number[]
}

async function createSolutions(solutionsObj : TaskSolutionModel[], task : Task) : Promise<TaskSolution[]> {
    const solutions : TaskSolution[] = [];
    for (let i : number = 0; i < solutionsObj.length; ++i) {
        const solution : TaskSolution = getRepository(TaskSolution).create(solutionsObj[i]);
        solution.task = task;
        solution.index = i;
        solutions.push(solution);
    }
    return getRepository(TaskSolution).save(solutions);
}

async function createRemarks(remarksObj : TaskRemarkModel[], task : Task) : Promise<TaskRemark[]> {
    const remarks : TaskRemark[] = [];
    for (let i : number = 0; i < remarksObj.length; ++i) {
        const remark : TaskRemark = getRepository(TaskRemark).create(remarksObj[i]);
        remark.task = task;
        remark.index = i;
        remarks.push(remark);
    }
    return getRepository(TaskRemark).save(remarks);
}

export async function createTask(authorId: number, obj: TaskPostCreateModel) : Promise<number> {
    const author : User = await getRepository(User).findOneOrFail(authorId);
    const material : Material = getRepository(Material).create();
    material.author = author;
    await getRepository(Material).save(material);

    const task : Task = getRepository(Task).create(obj);
    task.material = material;
    await getRepository(Task).save(task);

    await Promise.all([
        createSolutions(obj.solutions, task),
        createRemarks(obj.remarks, task),
        createQueryBuilder(Material).relation('themes').of(material).add(obj.themeIds)
    ]);
    return task.id;
}


function getSolution(obj : TaskSolution) : TaskSolutionModel {
    return pick(obj, ['body', 'grade']);
}

function getSolutions(arr : TaskSolution[]) : TaskSolutionModel[] {
    return sortByField(arr, 'index').map(el => getSolution(el));
}

function getRemark(obj : TaskRemark) : TaskRemarkModel {
    return pick(obj, ['type', 'label','body']);
}

function getRemarks(arr : TaskRemark[]) : TaskRemarkModel[] {
    return sortByField(arr, 'index').map(el => getRemark(el));
}

export async function getTaskMin(id: number) : Promise<TaskGetMinModel> {
    try {
        const task : Task = await createQueryBuilder(Task, 'task')
            .where('task.id = :id', {id})
            .innerJoin('task.material', 'material')
            .innerJoin('material.author', 'author')
                .addSelect(keysForSelection('author', keys<UserGetMinModel>()))
            .leftJoin('material.themes', 'theme')
                .addSelect('theme.id')
            .getOneOrFail();
        return {
            id : task.id,
            author : pick(task.material.author, keys<UserGetMinModel>()),
            statement : task.statement,
            themeIds : task.material.themes.map(theme => theme.id)
        };
    }
    catch (err) {
        console.log("error");
        throw err;
    }
}

export async function getTaskMax(id: number) : Promise<TaskGetMaxModel> {
    const task : Task = await createQueryBuilder(Task, 'task')
        .where('task.id = :id', {id})
        .innerJoin('task.material', 'material')
            .addSelect(keysForSelection<Material>('material', ['creationDate']))
        .innerJoin('material.author', 'author')
            .addSelect(keysForSelection<UserGetMinModel>('author', keys<UserGetMinModel>()))
        .leftJoin('task.solutions', 'solution')
            .addSelect(keysForSelection<TaskSolution>('solution', [...keys<TaskSolutionModel>(), 'index']))
        .leftJoin('task.remarks', 'remark')
            .addSelect(keysForSelection<TaskRemark>('remark', [...keys<TaskRemarkModel>(), 'index']))
        .leftJoin('material.themes', 'theme')
            .addSelect('theme.id')
        .getOneOrFail();
    return {
        id : task.id,
        author : pick(task.material.author, keys<UserGetMinModel>()),
        creationDate : task.material.creationDate,
        statement : task.statement,
        answer : task.answer,
        solutions : getSolutions(task.solutions),
        remarks : getRemarks(task.remarks),
        themeIds : task.material.themes.map(theme => theme.id)
    };
}