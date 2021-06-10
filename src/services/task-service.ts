import { keys } from "ts-transformer-keys";
import { createQueryBuilder, getRepository } from "typeorm";
import { PackageName } from "../compilation/options/latex-language-types";
import { LatexField } from "../entities/latex/latex-field";
import { List } from "../entities/list/list";
import { Task } from "../entities/task/task";
import { TaskRemark } from "../entities/task/task-remark";
import { TaskSolution } from "../entities/task/task-solution";
import { filterNonNullValues, keysForSelection, sortByField } from "../mlib";
import { TaskCompImpl, TaskCreateImpl, TaskMaxImpl, TaskMinImpl, TaskRemarkModel } from "../types/task-impl-types";
import { AccessMax } from "./access-service";
import { createLatexField, getLatexField, getLatexFieldComp, getPackageName, LatexFieldPostModel } from "./latex-service";
import { getListMin, ListMin } from "./list-service";
import { createMaterial, getMaterialAccess, getMaterialMax, getMaterialMin } from "./material-service";
import { UserMin } from "./user-service";
import { createBase, createVersion, getVersionAccess, getVersionMax, getVersionMin, VersionIds } from "./version-service";


export interface TaskCreate extends TaskCreateImpl {
    themeIds : number[];
    userNote?: string;
}

export interface TaskCreateRes {
    uuid : string;
    materialId : number,
    index : number
}

export async function createTask(obj : TaskCreate, actorId : number) : Promise<TaskCreateRes> {
    return createBase({
        authorId : actorId,
        themeIds : obj.themeIds,
        userNote : obj.userNote
    }).then(res => createTaskImpl(res.uuid, obj)
      .then(_ => res));
}

export interface TaskMin extends TaskMinImpl{
    author : UserMin;
//    owner : UserMin    TODO
}

export async function getTaskMin(uuid : string, actorId : number) : Promise<TaskMin> {
    const versionObj = await getVersionMax(uuid, actorId);
    const minObj = await getTaskMinImpl(uuid)
    return {
        ...minObj,
        author : versionObj.material.author
    };
}

export interface TaskMax extends TaskMaxImpl, VersionIds {
    author : UserMin;
    themeIds : number[];
    creationDate : Date;
    userNote ?: string;
    access : AccessMax;
}

export async function getTaskMax(uuid : string, actorId : number) : Promise<TaskMax> {
    const version = await getVersionMax(uuid, actorId);
    const access = await getVersionAccess(uuid);
    const task = await getTaskMaxImpl(uuid, actorId);
    return {
        ... version.material,
        access,
        materialId : version.materialId,

        index : version.index,
        ...task
    }
}

export interface TaskComp extends TaskCompImpl, VersionIds {
    packages : string[];
    author : UserMin;
}

export async function getTaskComp(uuid : string, actorId : number) : Promise<TaskComp> {
    const version = await getVersionMin(uuid);
    const taskComp = await getTaskCompImpl(uuid);
    const promises : Promise<PackageName>[] =
        taskComp.statement.packageUuids.map(uuid => getPackageName(uuid));
    taskComp.solutions.forEach(sol => {
        promises.push(...sol.packageUuids.map(uuid => getPackageName(uuid)));
    })
    const packages = await Promise.all(promises);

    return {
        materialId : version.materialId,
        index : version.index,
        ...taskComp,
        packages,
        author : version.author
    };
}

export async function getRemarkTypes() : Promise<string[]> {
    return createQueryBuilder(TaskRemark, 'remark')
        .select(keysForSelection<TaskRemark>('remark', ['type']))
        .getMany()
        .then(rs => rs.map(remark => remark.type));
}

// Private methods implementation

async function createTaskImpl(uuid : string, obj : TaskCreateImpl) : Promise<string> {
    const task : Task = await getRepository(Task).save({
        uuid,
        statement : await createLatexField(obj.statement),
        answer : obj.answer
    });
    await Promise.all([
        addSolutions(obj.solutions, task),
        addRemarks(obj.remarks, task),
    ]);
    return uuid;
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

async function getTaskMinImpl(uuid: string) : Promise<TaskMinImpl> {
    const task : Task = await createQueryBuilder(Task, 'task')
        .where({ uuid })
        .addSelect('task.statementId')
        .getOneOrFail();
    return {
        uuid : task.uuid,
        statement : await getLatexField(task.statementId)
    };
}

async function getTaskUsedInLists(uuid: string, actorId : number) : Promise<ListMin[]> {
    const listIds = await createQueryBuilder(List, 'list')
        .innerJoin('list.blocks', 'block')
        .innerJoin('block.blockTasks', 'blockTasks')
        .innerJoin('blockTasks.taskItems', 'item')
        .innerJoin('item.task', 'task')
        .where({ uuid })
        .select('list.uuid')
        .getRawMany();
    return Promise.all(
        listIds.map(listId => getListMin(listId, actorId).catch((err) => null))
    ).then(filterNonNullValues);
}

async function getTaskMaxImpl(uuid : string, actorId : number) : Promise<TaskMaxImpl> {
    const task : Task = await createQueryBuilder(Task, 'task')
        .where({ uuid })
            .addSelect('task.statementId')
        .leftJoin('task.solutions', 'solution')
            .addSelect(keysForSelection<TaskSolution>('solution', ['index', 'bodyId']))
        .leftJoin('task.remarks', 'remark')
            .addSelect(keysForSelection<TaskRemark>('remark', keys<TaskRemarkModel>()))
        .getOneOrFail();
    sortByField(task.solutions, 'index');
    sortByField(task.remarks, 'index');
    return {
        uuid : task.uuid,
        statement : await getLatexField(task.statementId),
        answer : task.answer,
        solutions : await Promise.all(
                task.solutions.map(s => getLatexField(s.bodyId))
            ),
        remarks : task.remarks,
        usedInLists : await getTaskUsedInLists(task.uuid, actorId)
    };
}

async function getTaskCompImpl(uuid : string) : Promise<TaskCompImpl> {
    const task : Task = await createQueryBuilder(Task, 'task')
        .where({ uuid })
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
        uuid,
        statement : await getLatexFieldComp(task.statement.id),
        answer : task.answer,
        solutions : await Promise.all(
                task.solutions.map(s => getLatexFieldComp(s.bodyId))
            )
    }
}
