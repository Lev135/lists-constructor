import { createQueryBuilder, getRepository } from "typeorm";
import { getListPackages } from "../compilation/compilation-types";
import { PackageName } from "../compilation/options/latex-language-types";
import { LatexPackage } from "../entities/latex/latex-package";
import { List } from "../entities/list/list";
import { ListBlock } from "../entities/list/list-block";
import { ListBlockComment } from "../entities/list/list-block-comment";
import { ListBlockTaskItem } from "../entities/list/list-block-task-item";
import { ListBlockTasks } from "../entities/list/list-block-tasks";
import { Task } from "../entities/task/task";
import { AccessType } from "../entities/user-access";
import { keysForSelection, sortByField } from "../mlib";
import { ListBlockComp, ListBlockModel, ListBlockCreate, ListComplImpl, ListMaxImpl, ListMinImpl, ListCreateImpl, ListBlockTasksCreate, ListBlockTasksModel, ListBlockTasksComp } from "../types/list-impl-types";
import { getPackageName, packageCheckUuid,  } from "./latex-service";
import { getTaskComp, getTaskMin, TaskMin } from "./task-service";
import { createBase, createVersion, getVersionalMaxInfo, getVersionalMinInfo, versionCheckAccessLevel } from "./version-service";
import * as t from "../types/list-types"
import { VersionalMaxInfo, VersionalMinInfo } from "../types/version-impl-types";


export async function createList(obj : t.PostCreateBody, actorId : number) : Promise<t.PostCreateSend> {
    await createListImplCheck(obj.list, actorId);

    const versionIds = await createBase(obj.material, actorId);
    await createListImpl(versionIds.uuid, obj.list, actorId)
    return versionIds;
}

export async function editList(uuid: string, obj : t.PutEditBody, actorId : number) : Promise <t.PutEditSend> {
    await createListImplCheck(obj.list, actorId);
    await versionCheckAccessLevel(uuid, actorId, AccessType.write);

    const vIds = await createVersion(uuid, actorId);
    await createListImpl(vIds.uuid, obj.list, actorId);
    return vIds;
}

export interface ListMin extends VersionalMinInfo {
    list : ListMinImpl
}

export async function getListMin(uuid : string, actorId : number) : Promise<ListMin> {
    await versionCheckAccessLevel(uuid, actorId, AccessType.read);

    const info = await getVersionalMinInfo(uuid, actorId);
    const list = await getListMinImpl(uuid);

    return {
        ...info,
        list
    };
}

export async function getListMax(uuid : string, actorId : number) : Promise<t.GetViewSend> {
    await versionCheckAccessLevel(uuid, actorId, AccessType.read);
    
    const info = await getVersionalMaxInfo(uuid, actorId);
    const list = await getListMaxImpl(uuid, actorId);
    
    await getListMaxImplCheck(list, actorId);
    
    return {
        ...info,
        list
    }
}

export interface ListComp extends VersionalMaxInfo {
    list : ListComplImpl,
    packages : string[]
}

export async function getListComp(uuid : string, actorId : number) : Promise<ListComp> {
    await versionCheckAccessLevel(uuid, actorId, AccessType.read);

    const info = await getVersionalMaxInfo(uuid, actorId);
    const list = await getListCompImpl(uuid, actorId);
    const packages : PackageName[] = await Promise.all(
        getListPackages({ 
            ...list,
            author: info.material.author,
            uuid
        }).map(getPackageName)
    );

    await getListCompImplCheck(list, actorId);
    
    return {
        ...info,
        list,
        packages,
    };
}

// Private methods implementation

async function checkListTaskBlocks(taskBlocks : { taskUuids : string[] }[], actorId : number) {
    const taskUuids = taskBlocks.flatMap(block => block.taskUuids);
    return Promise.all(
        taskUuids.map(uuid => versionCheckAccessLevel(uuid, actorId, AccessType.read))
    ).then();
}

async function createListImplCheck(obj : ListCreateImpl, actorId : number) {
    await checkListTaskBlocks(
        obj.blocks.filter(block => 'taskUuids' in block) as ListBlockTasksCreate[],
        actorId
    );
    await Promise.all(
        obj.packageUuids.map(uuid => packageCheckUuid(uuid))
    );
}

async function createListImpl(uuid : string, obj : ListCreateImpl, actorId : number) {
    return getRepository(List).save({
        uuid,
        title: obj.title
    }).then(list => createBlocks(obj.blocks, list, actorId));
}

async function getBlock(obj : ListBlock, actorId : number) : Promise<ListBlockModel> {
    if (obj.blockComment) {
        return {
            body : obj.blockComment.body
        }
    }
    else if (obj.blockTasks) {
        return {
            tasks : await Promise.all(
                obj.blockTasks.taskItems.map(item => getTaskMin(item.task.uuid, actorId))
            )
        }
    }
    else {
        throw new Error("Unknown block type");
    }
}

async function getListMinImpl(uuid : string) : Promise<ListMinImpl> {
    return getRepository(List).findOneOrFail(uuid)
        .then(list => ({
            title : list.title
        }));
}

async function getListMaxImplCheck(obj : ListMaxImpl, actorId : number) {
    const taskBlocks = obj.blocks.filter(block => 'tasks' in block) as ListBlockTasksModel[]
    checkListTaskBlocks(
        taskBlocks.map(block => ({ 
            taskUuids : block.tasks.map(task => task.curVersion.uuid )
        })),
        actorId
        );
}

async function getListMaxImpl(uuid : string, actorId : number) : Promise<ListMaxImpl> {
    try {
        const list : List = await createQueryBuilder(List, 'list')
            .where({ uuid })
            .leftJoin('list.blocks', 'block')
                .addSelect(keysForSelection<ListBlock>('block', [ 'index' ]))
            .leftJoin('block.blockComment', 'blockComment')
                .addSelect(keysForSelection<ListBlockComment>('blockComment', ['body']))
            .leftJoin('block.blockTasks', 'blockTasks')
                .addSelect(keysForSelection<ListBlockTasks>('blockTasks', [ 'id' ]))
            .leftJoin('blockTasks.taskItems', 'item')
                .addSelect(keysForSelection<ListBlockTaskItem>('item', [ 'index' ]))
            .leftJoin('item.task', 'task')
                .addSelect(keysForSelection<Task>('task', [ 'uuid' ]))
            .leftJoin('list.packages', 'package')
                .addSelect(keysForSelection<LatexPackage>('package', ['uuid']))
            .getOneOrFail();
        sortByField(list.blocks, 'index');
        return {
            title: list.title,
            blocks: await Promise.all(list.blocks.map(block => getBlock(block, actorId))),
            packageUuids: list.packages.map(pack => pack.uuid)
        }
    }
    catch (err) {
        console.log(`Error while getting list max (uuid: ${uuid})`);
        throw err;
    }
}

async function getBlockComp(blockId : number, actorId : number) : Promise<ListBlockComp> {
    const commentBlock : ListBlockComment | undefined = await createQueryBuilder(ListBlockComment, 'comment')
        .where({id : blockId})
        .addSelect(keysForSelection<ListBlockComment>('comment', ['body']))
        .getOne();
    const tasksBlock : ListBlockTasks | undefined = await createQueryBuilder(ListBlockTasks, 'blockTasks')
        .where({id : blockId})
        .leftJoin('blockTasks.taskItems', 'item')
            .addSelect(keysForSelection<ListBlockTaskItem>('item', ['index']))
        .leftJoin('item.task', 'task')
            .addSelect(keysForSelection<Task>('task', ['uuid']))
        .getOne();
    if (commentBlock) {
        return {
            body : commentBlock.body
        }
    }
    if (tasksBlock) {
        sortByField(tasksBlock.taskItems, 'index');
        return {
            tasks : await Promise.all(tasksBlock.taskItems.map(item => getTaskComp(item.task.uuid, actorId)))
        }
    }
    throw new Error("Unknown block type");
}

async function getListCompImplCheck(obj : ListComplImpl, actorId : number) {
    const taskBlocks = obj.blocks.filter(block => 'tasks' in block) as ListBlockTasksComp[]
    checkListTaskBlocks(
        taskBlocks.map(block => ({ 
            taskUuids : block.tasks.map(task => task.curVersion.uuid )
        })),
        actorId
        );
}

async function getListCompImpl(uuid : string, actorId : number) : Promise<ListComplImpl> {
    const list : List = await createQueryBuilder(List, 'list')
        .where({ uuid })
        .leftJoin('list.blocks', 'block')
            .addSelect(keysForSelection<ListBlock>('block', [ 'id', 'index' ]))
        .leftJoin('list.packages', 'package')
            .addSelect(keysForSelection<LatexPackage>('package', ['uuid']))
        .getOneOrFail();
    sortByField(list.blocks, 'index');
    return {
        title: list.title,
        blocks: await Promise.all(list.blocks.map(block => getBlockComp(block.id, actorId))),
        packageUuids : list.packages.map(pack => pack.uuid)
    }   
}

async function createBlockTasksItem(taskUuid : string, index : number, blockTasks : ListBlockTasks, actorId : number) {
    await getRepository(ListBlockTaskItem).save({
        block : blockTasks,
        index,
        taskUuid
    });
}

async function createBlock(blockObj : ListBlockCreate, index : number, list : List, actorId : number) {
    const block = await getRepository(ListBlock).save({ index, list });
    if ('taskUuids' in blockObj) {
        const blockTasks = await getRepository(ListBlockTasks).save({ listBlock : block });
        await Promise.all(blockObj.taskUuids.map((taskUuid, i) => 
            createBlockTasksItem(taskUuid, i, blockTasks, actorId)    
        ));
    }
    else {
        await getRepository(ListBlockComment).save({
            listBlock : block, 
            body : blockObj.body 
        });
    }
}

async function createBlocks(blocksObj : ListBlockCreate[], list : List, actorId : number) : Promise<void>{
    return Promise.all(blocksObj.map((blocksObj, i) =>
        createBlock(blocksObj, i, list, actorId)
    )).then()
}

