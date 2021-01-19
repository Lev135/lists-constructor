import { createQueryBuilder, getRepository } from "typeorm";
import { Material } from "../entities/material/material";
import { Task } from "../entities/task/task";
import { TaskRemark } from "../entities/task/task-remark";
import { TaskSolution } from "../entities/task/task-solution";
import { User } from "../entities/user";
import { pick, sortByField } from "../mlib";
import { UserGetMinModel } from "./user-service";

export interface TaskGetMinModel {
    materialId : number,
    author: UserGetMinModel,
    statement : string
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
    notes: TaskRemarkModel[]
}

export async function createTask(authorId: number, obj: TaskPostCreateModel) : Promise<number> {
    // Где должны быть Id'шники, а где объекты? Вот здесь, например, нужно получить объект
    const author : User = await getRepository(User).findOneOrFail(authorId);
    console.log(author);
    const material : Material = getRepository(Material).create();
    material.author = author;
    await getRepository(Material).save(material);
    console.log('Material saved');
    console.log(material);


    const task : Task = getRepository(Task).create();
    task.material = material;
    task.statement = obj.statement;
    task.answer = obj.answer;
    await getRepository(Task).save(task);

    const promises : Promise<any>[] = [];
    const solutions : TaskSolution[] = [];
    for (let i : number = 0; i < obj.solutions.length; ++i) {
        const solutionObj : TaskSolutionModel = obj.solutions[i];
        const solution : TaskSolution = getRepository(TaskSolution).create(solutionObj);
        solution.task = task;
        solution.index = i;
        solutions.push(solution);
    }
    promises.push(getRepository(TaskSolution).save(solutions));
    const remarks : TaskRemark[] = [];
    for (let i : number = 0; i < obj.notes.length; ++i) {
        const remarkObj : TaskRemarkModel = obj.notes[i];
        const remark : TaskRemark = getRepository(TaskRemark).create(remarkObj);
        remark.task = task;
        remark.index = i;
        remarks.push(remark);
    }
    promises.push(getRepository(TaskRemark).save(remarks)); 
    await Promise.all(promises);
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
    const task : Task = await createQueryBuilder(Task, 'task')
        .where('task.id = :id', {id})
        .innerJoinAndSelect('task.material', 'material', 'material.id = :id', {id})
        .innerJoinAndSelect('material.author', 'author', 'author.id = material.authorId')
        .getOneOrFail();
    console.log(task);
    return {
        materialId : task.id,
        author : pick(task.material.author, ['id', 'name', 'surname', 'patronymic', 'email']),
        statement : task.statement
    };
}

export async function getTaskMax(id: number) : Promise<TaskGetMaxModel> {
    const task : Task = await createQueryBuilder(Task, 'task')
        .where('task.id = :id', {id})
        .innerJoinAndSelect('task.material', 'material', 'material.id = :id', {id})
        .innerJoinAndSelect('material.author', 'author', 'author.id = material.authorId')
        .leftJoinAndSelect('task.solutions', 'solution', 'solution.taskId = :id', {id})
        .leftJoinAndSelect('task.remarks', 'remark', 'remark.taskId = :id', {id})
        .getOneOrFail();
    return {
        materialId : task.id,
        author : pick(task.material.author, ['id', 'name', 'surname', 'patronymic', 'email']),
        creationDate : task.material.creationDate,
        statement : task.statement,
        answer : task.answer,
        solutions : getSolutions(task.solutions),
        remarks : getRemarks(task.remarks)
    };
}