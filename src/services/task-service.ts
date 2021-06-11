import { keys } from "ts-transformer-keys";
import { createQueryBuilder, getRepository } from "typeorm";
import { PackageName } from "../compilation/options/latex-language-types";
import { LatexPackage } from "../entities/latex/latex-package";
import { List } from "../entities/list/list";
import { Task } from "../entities/task/task";
import { TaskRemark } from "../entities/task/task-remark";
import { TaskSolution } from "../entities/task/task-solution";
import { AccessType } from "../entities/user-access";
import { filterNonNullValues, keysForSelection, sortByField } from "../mlib";
import { TaskCompImpl, TaskCreateImpl, TaskMaxImpl, TaskMinImpl, TaskRemarkModel } from "../types/task-impl-types";
import { getPackage, getPackageName, packageCheckUuid } from "./latex-service";
import { getListMin, ListMin } from "./list-service";
import { UserMin } from "./user-service";
import { createBase, createVersion, getVersionalMaxInfo, getVersionalMinInfo, versionCheckAccessLevel } from "./version-service";
import * as t from "../types/task-types"
import { VersionalMinInfo, VersionIds } from "../types/version-impl-types";

export async function createTask(obj : t.PostCreateBody, actorId : number) : Promise<t.PostCreateSend> {
    await createTaskImplCheck(obj.task);
    
    const vIds = await createBase(obj.material, actorId);
    await createTaskImpl(vIds.uuid, obj.task);
    return vIds;
}

export async function editTask(uuid : string, obj : t.PutEditBody, actorId : number) : Promise<t.PutEditSend> {
    await createTaskImplCheck(obj.task);
    await versionCheckAccessLevel(uuid, actorId, AccessType.write);
    
    const vIds = await createVersion(uuid, actorId);
    await createTaskImpl(vIds.uuid, obj.task);
    return vIds;
}

export interface TaskMin extends VersionalMinInfo {
    task : TaskMinImpl
}

export async function getTaskMin(uuid : string, actorId : number) : Promise<TaskMin> {
    await versionCheckAccessLevel(uuid, actorId, AccessType.read);
    
    const info = await getVersionalMinInfo(uuid, actorId);
    const task = await getTaskMinImpl(uuid)
    return {
        ...info,
        task
    };
}

export async function getTaskMax(uuid : string, actorId : number) : Promise<t.GetViewSend> {
    await versionCheckAccessLevel(uuid, actorId, AccessType.read);
    
    const info = await getVersionalMaxInfo(uuid, actorId);
    const task = await getTaskMaxImpl(uuid);
    const usedInLists = await getTaskUsedInLists(uuid, actorId) 
    
    return {
        ...info,
        task,
        other : {
            usedInLists
        }
    }
}

export interface TaskComp extends TaskCompImpl, VersionIds {
    packages : string[];
    author : UserMin;
}

export async function getTaskComp(uuid : string, actorId : number) : Promise<TaskComp> {
    const info = await getVersionalMinInfo(uuid, actorId);
    const taskComp = await getTaskCompImpl(uuid);
    const promises : Promise<PackageName>[] =
        taskComp.packageUuids.map(uuid => getPackageName(uuid));
    taskComp.solutions.forEach(sol => {
        promises.push(...sol.packageUuids.map(uuid => getPackageName(uuid)));
    })
    const packages = await Promise.all(promises);

    return {
        ...info.curVersion,
        ...taskComp,
        packages,
        author : info.material.author
    };
}

export async function getRemarkTypes() : Promise<string[]> {
    return createQueryBuilder(TaskRemark, 'remark')
        .select(keysForSelection<TaskRemark>('remark', ['type']))
        .getMany()
        .then(rs => rs.map(remark => remark.type));
}

// Private methods implementation

async function createTaskImplCheck(obj : TaskCreateImpl) : Promise<void> {
    await Promise.all(obj.packageUuids.map(packageCheckUuid));
    await Promise.all(obj.solutions.flatMap(sol => sol.packageUuids.map(packageCheckUuid)))
}

async function createTaskImpl(uuid : string, obj : TaskCreateImpl) : Promise<string> {
    const packages = await Promise.all(obj.packageUuids.map(getPackage));
    const solutions = await Promise.all(
        obj.solutions.map(async (obj, index) => ({
            body : obj.body,
            index,
            packages : await Promise.all(obj.packageUuids.map(getPackage))
        }))
    );
    const remarks = obj.remarks.map((obj, index) => ({
        ...obj, index
    }));
    const task : Task = await getRepository(Task).save({
        uuid,
        statement : obj.statement,
        answer : obj.answer,
        packages,
        solutions,
        remarks
    });
    return uuid;
}

async function getTaskMinImpl(uuid: string) : Promise<TaskMinImpl> {
    const task : Task = await createQueryBuilder(Task, 'task')
        .where({ uuid })
        .addSelect(keysForSelection<Task>('task', ['statement']))
        .getOneOrFail();
    return {
        statement : task.statement
    };
}

async function getTaskUsedInLists(uuid: string, actorId : number) : Promise<ListMin[]> {
    const listIds : string[] = await createQueryBuilder(List, 'list')
        .innerJoin('list.blocks', 'block')
        .innerJoin('block.blockTasks', 'blockTasks')
        .innerJoin('blockTasks.taskItems', 'item')
        .innerJoin('item.task', 'task')
        .where('task.uuid = :uuid', { uuid })
        .select('list.uuid')
        .getRawMany();
    const filteredIds = await Promise.all(
        listIds.map(listUuId => 
            versionCheckAccessLevel(listUuId, actorId, AccessType.read)
            .then(_ => listUuId)
            .catch(_ => null)
        )
    ).then(filterNonNullValues);
    return Promise.all(
        listIds.map(listId => getListMin(listId, actorId))
    );
}

async function getTaskMaxImpl(uuid : string) : Promise<TaskMaxImpl> {
    const task : Task = await createQueryBuilder(Task, 'task')
        .where({ uuid })
            .addSelect(keysForSelection<Task>('task', ['statement']))
        .leftJoin('task.solutions', 'solution')
            .addSelect(keysForSelection<TaskSolution>('solution', ['index', 'body']))
        .leftJoin('solution.packages', 'sol-pack')
            .addSelect(keysForSelection<LatexPackage>('sol-pack', ['uuid']))
        .leftJoin('task.remarks', 'remark')
            .addSelect(keysForSelection<TaskRemark>('remark', keys<TaskRemarkModel>()))
        .leftJoin('task.packages', 'pack')
            .addSelect(keysForSelection<LatexPackage>('pack', ['uuid']))
        .getOneOrFail();
    sortByField(task.solutions, 'index');
    sortByField(task.remarks, 'index');
    return {
        statement : task.statement,
        answer : task.answer,
        solutions : task.solutions.map(s => ({ body : s.body, packageUuids : s.packages.map(pack => pack.uuid) })),
        remarks : task.remarks,
        packageUuids : task.packages.map(pack => pack.uuid)
    };
}

async function getTaskCompImpl(uuid : string) : Promise<TaskCompImpl> {
    const task = await getTaskMaxImpl(uuid);
    return {
        uuid,
        statement : task.statement,
        answer : task.answer,
        solutions : task.solutions,
        packageUuids : task.packageUuids
    }
}
