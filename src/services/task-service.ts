import { keys } from "ts-transformer-keys";
import { createQueryBuilder, getRepository } from "typeorm";
import { PackageName } from "../compilation/options/latex-language-types";
import { LatexField } from "../entities/latex/latex-field";
import { List } from "../entities/list/list";
import { Task } from "../entities/task/task";
import { TaskRemark } from "../entities/task/task-remark";
import { TaskSolution } from "../entities/task/task-solution";
import { keysForSelection, pick, sortByField } from "../mlib";
import { TaskCompImpl, TaskCreateImpl, TaskMaxImpl, TaskMinImpl, TaskRemarkModel } from "../types/task-impl-types";
import { AccessMax } from "./access-service";
import { createLatexField, getLatexField, getLatexFieldComp, getPackageName, LatexFieldPostModel } from "./latex-service";
import { getListMin, ListMin } from "./list-service";
import { createMaterial, getMaterialMax, getMaterialMin } from "./material-service";
import { UserMin } from "./user-service";


export interface TaskCreate extends TaskCreateImpl {
    themeIds : number[];
    userNote?: string;
}

export async function createTask(obj: TaskCreate, actorId : number) : Promise<number> {
    return createMaterial({
        authorId : actorId, ...obj 
    }).then(materialId => createTaskImpl(materialId, obj));
}

export interface TaskMin extends TaskMinImpl{
    author : UserMin;
//    owner : UserMin    TODO
}

export async function getTaskMin(id : number, actorId : number) : Promise<TaskMin> {
    const material = await getMaterialMin(id, actorId);
    const minObj = await getTaskMinImpl(id)
    return {
        ...minObj,
        author : material.author
    };
}

export interface TaskMax extends TaskMaxImpl {
    author : UserMin;
    themeIds : number[];
    creationDate : Date;
    userNote ?: string;
    accessRules : AccessMax;
}

export async function getTaskMax(id: number, actorId : number) : Promise<TaskMax> {
    const material = await getMaterialMax(id, actorId);
    const task = await getTaskMaxImpl(id, actorId);
    return {
        ...material,
        ...task
    }
}

export interface TaskComp extends TaskCompImpl {
    packages : string[];
    author : UserMin;
}

export async function getTaskComp(id : number, actorId : number) : Promise<TaskComp> {
    const material = await getMaterialMin(id, actorId);
    const taskComp = await getTaskCompImpl(id);
    const promises : Promise<PackageName>[] = 
        taskComp.statement.packageUuids.map(uuid => getPackageName(uuid));
    taskComp.solutions.forEach(sol => {
        promises.push(...sol.packageUuids.map(uuid => getPackageName(uuid)));
    })
    const packages = await Promise.all(promises);

    return {
        ...taskComp,
        packages,
        author : material.author
    };
}

export async function getRemarkTypes() : Promise<string[]> {
    const remarks =  await createQueryBuilder(TaskRemark, 'remark')
        .select(keysForSelection<TaskRemark>('remark', ['type']))
        .getMany();
    return remarks.map(remark => remark.type);
}


// Private methods implementation

async function createTaskImpl(materialId : number, obj : TaskCreateImpl) : Promise<number> {
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


async function getTaskMinImpl(id: number) : Promise<TaskMinImpl> {
    const task : Task = await createQueryBuilder(Task, 'task')
        .where({ id })
        .addSelect('task.statementId')
        .getOneOrFail();
    return {
        id : task.id,
        statement : await getLatexField(task.statementId)
    };
}

async function getTaskUsedInLists(id: number, actorId : number) : Promise<ListMin[]> {
    const listIds = await createQueryBuilder(List, 'list')
        .innerJoin('list.blocks', 'block')
        .innerJoin('block.blockTasks', 'blockTasks')
        .innerJoin('blockTasks.taskItems', 'item')
        .innerJoin('item.task', 'task')
        .where('task.id = :id', { id })
        .select('list.id')
        .getRawMany();
    const lists : (ListMin | undefined)[] = await Promise.all(
        listIds.map(listId => getListMin(listId, actorId).catch())
    );
    return lists.filter(list => typeof(list) !== 'undefined') as ListMin[];
}

async function getTaskMaxImpl(id : number, actorId : number) : Promise<TaskMaxImpl> {
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
        usedInLists : await getTaskUsedInLists(task.id, actorId)
    };
}

async function getTaskCompImpl(id : number) : Promise<TaskCompImpl> {
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
