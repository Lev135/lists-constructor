import { keys } from "ts-transformer-keys";
import { createQueryBuilder, getRepository } from "typeorm";
import { Material } from "../entities/material/material";
import { Task } from "../entities/task/task";
import { TaskRemark } from "../entities/task/task-remark";
import { TaskSolution } from "../entities/task/task-solution";
import { User } from "../entities/user";
import { keysForSelection, pick, sortByField } from "../mlib";
import { addPackages, createLatexField, LatexFieldGetModel, LatexFieldPostModel } from "./latex-service";
import { createMaterial, getMaterial } from "./material-service";
import { UserGetMinModel } from "./user-service";

export interface TaskGetMinModel {
    id : number,
    author: UserGetMinModel,
    statement : LatexFieldGetModel,
    themeIds : number[]
}

export interface TaskSolutionGetModel {
    body: LatexFieldGetModel,
}
export interface TaskSolutionPostModel {
    body : LatexFieldPostModel
}

export interface TaskRemarkModel {
    type: string,
    label: string,
    body: string
}

export interface TaskGetMaxModel extends TaskGetMinModel {
    creationDate: Date,
    answer: string,
    solutions: TaskSolutionGetModel[],
    remarks: TaskRemarkModel[]  
}

export interface TaskPostCreateModel {
    // authorId не добавляем, так как автора будем добавлять в controller'e отдельно,
    // а всё остальное будет приходить JSON'ом с front end'a
    statement: LatexFieldPostModel,
    answer: string,
    solutions: TaskSolutionPostModel[],
    remarks: TaskRemarkModel[],
    themeIds : number[]
}

async function addSolutions(solutionsObj : TaskSolutionPostModel[], task : Task) : Promise<TaskSolution[]> {
    const promises : Promise<TaskSolution>[] = [];
    for (let i : number = 0; i < solutionsObj.length; ++i) {
        promises.push(getRepository(TaskSolution).save({
            body : await createLatexField(solutionsObj[i].body),
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

async function createTaskImpl(materialId: number, obj: TaskPostCreateModel) : Promise<number> {
    const task : Task = await getRepository(Task).save({
        material : await getMaterial(materialId),
        statement : await createLatexField(obj.statement),
        answer : obj.answer
    });

    await Promise.all([
        addSolutions(obj.solutions, task),
        addRemarks(obj.remarks, task),
    ]);
    return task.id;
}

export async function createTask(authorId : number, obj : TaskPostCreateModel) : Promise<number> {
    const materialId : number = await createMaterial(authorId, obj.themeIds);
    return createTaskImpl(materialId, obj);
}


export async function getTaskMin(id: number) : Promise<TaskGetMinModel> {
    try {
        const task : Task = await createQueryBuilder(Task, 'task')
            .where('task.id = :id', {id})
            .innerJoin('task.material', 'material')
                .addSelect('material.id') // Only for joining author (without it doesn't work)
            .innerJoin('task.statement', 'statement')
                .addSelect('statement.body')
            .innerJoin('material.author', 'author')
                .addSelect(keysForSelection('author', keys<UserGetMinModel>()))
            .leftJoin('material.themes', 'theme')
                .addSelect('theme.id')
            .getOneOrFail();
        console.log(task);
        return {
            id : task.id,
            author : task.material.author,
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
        .innerJoin('task.statement', 'statement')
            .addSelect('statement.body')
        .innerJoin('task.material', 'material')
            .addSelect(keysForSelection<Material>('material', ['creationDate']))
        .innerJoin('material.author', 'author')
            .addSelect(keysForSelection<UserGetMinModel>('author', keys<UserGetMinModel>()))
        .leftJoin('task.solutions', 'solution')
            .addSelect(keysForSelection<TaskSolution>('solution', keys<TaskSolutionGetModel>()))
            .addOrderBy('solution.index')
        .leftJoin('solution.body', 'solution_body')
            .addSelect('solution_body.body')
        .leftJoin('task.remarks', 'remark')
            .addSelect(keysForSelection<TaskRemark>('remark', keys<TaskRemarkModel>()))
            .addOrderBy('remark.index')
        .leftJoin('material.themes', 'theme')
            .addSelect('theme.id')
        .getOneOrFail();
    return {
        id : task.id,
        author : task.material.author,
        creationDate : task.material.creationDate,
        statement : task.statement,
        answer : task.answer,
        solutions : task.solutions,
        remarks : task.remarks,
        themeIds : task.material.themes.map(theme => theme.id)
    };
}