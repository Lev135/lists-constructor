import { createQueryBuilder, getRepository } from "typeorm";
import { getListPackages } from "../compilation/compilation-types";
import { PackageName } from "../compilation/options/latex-language-types";
import { LatexField } from "../entities/latex/latex-field";
import { List } from "../entities/list/list";
import { ListBlock } from "../entities/list/list-block";
import { ListBlockComment } from "../entities/list/list-block-comment";
import { ListBlockTaskItem } from "../entities/list/list-block-task-item";
import { ListBlockTasks } from "../entities/list/list-block-tasks";
import { Task } from "../entities/task/task";
import { AccessType } from "../entities/user-access";
import { keysForSelection, sortByField } from "../mlib";
import { ListBlockComp, ListBlockModel, ListBlockCreate, ListComplImpl, ListMaxImpl, ListMinImpl, ListCreateImpl } from "../types/list-impl-types";
import { AccessMax } from "./access-service";
import { createLatexField, getLatexField, getLatexFieldComp, getPackageName,  } from "./latex-service";
import { getTaskComp, getTaskMin } from "./task-service";
import { UserMin } from "./user-service";
import { createBase, getVersionAccess, getVersionMax, getVersionMin, versionCheckAccessLevel, VersionIds } from "./version-service";


export interface ListCreate extends ListCreateImpl {
    themeIds : number[],
    userNote ?: string
}

export async function createList(obj : ListCreate, actorId : number) : Promise<VersionIds> {
    return createBase({
        authorId : actorId, ...obj
    }).then(versionIds => createListImpl(versionIds.uuid, obj, actorId)
      .then(_ => versionIds)
    );
}

export interface ListMin extends ListMinImpl, VersionIds {
    author : UserMin;
//    owner : UserMin; TODO
}

export async function getListMin(uuid : string, actorId : number) : Promise<ListMin> {
    return getVersionMax(uuid, actorId)
        .then(version => getListMinImpl(uuid)
        .then(list => ({
            uuid,
            materialId : version.materialId,
            index : version.index,
            title : list.title,
            author : version.material.author,
        })));
}

export interface ListMax extends ListMaxImpl, VersionIds {
    author : UserMin;
    themeIds : number[];
    creationDate : Date;
    userNote ?: string;
    access : AccessMax;
}

export async function getListMax(uuid : string, actorId : number) : Promise<ListMax> {
    const version = await getVersionMax(uuid, actorId);
    const access = await getVersionAccess(uuid);
    const list = await getListMaxImpl(uuid, actorId);
    return {
        uuid,
        materialId : version.materialId,
        index : version.index,
        ...version.material,
        access,
        ...list
    }
}

export interface ListComp extends ListComplImpl {
    packages : string[];
    author : UserMin;
}

export async function getListComp(uuid : string, actorId : number) : Promise<ListComp> {
    const version = await getVersionMax(uuid, actorId);
    const listComp = await getListCompImpl(uuid, actorId);
    const packages : PackageName[] = await Promise.all(
        getListPackages({ 
            ...listComp,
            author: version.material.author,
            uuid
        }).map(getPackageName)
    );
    
    return {
        ...listComp,
        packages,
        author : version.material.author
    };
}

// POST models:

async function createListImpl(uuid : string, obj : ListCreateImpl, actorId : number) {
    return getRepository(List).save({
        uuid,
        title: obj.title
    }).then(list => createBlocks(obj.blocks, list, actorId));
}

async function getBlock(obj : ListBlock, actorId : number) : Promise<ListBlockModel> {
    if (obj.blockComment) {
        return {
            body : await getLatexField(obj.blockComment.bodyId)
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

async function getListMaxImpl(uuid : string, actorId : number) : Promise<ListMaxImpl> {
    try {
        const list : List = await createQueryBuilder(List, 'list')
            .where({ uuid })
            .leftJoin('list.blocks', 'block')
                .addSelect(keysForSelection<ListBlock>('block', [ 'index' ]))
            .leftJoin('block.blockComment', 'blockComment')
                .addSelect(keysForSelection<ListBlockComment>('blockComment', ['bodyId']))
            .leftJoin('block.blockTasks', 'blockTasks')
                .addSelect(keysForSelection<ListBlockTasks>('blockTasks', [ 'id' ]))
            .leftJoin('blockTasks.taskItems', 'item')
                .addSelect(keysForSelection<ListBlockTaskItem>('item', [ 'index' ]))
            .leftJoin('item.task', 'task')
                .addSelect(keysForSelection<Task>('task', [ 'uuid' ]))
            .getOneOrFail();
        sortByField(list.blocks, 'index');
        return {
            title: list.title,
            blocks: await Promise.all(list.blocks.map(block => getBlock(block, actorId)))
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
        .leftJoin('comment.body', 'body')
            .addSelect(keysForSelection<LatexField>('body', ['id']))
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
            body : await getLatexFieldComp(commentBlock.body.id)
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

async function getListCompImpl(uuid : string, actorId : number) : Promise<ListComplImpl> {
    const list : List = await createQueryBuilder(List, 'list')
        .where({ uuid })
        .leftJoin('list.blocks', 'block')
            .addSelect(keysForSelection<ListBlock>('block', [ 'id', 'index' ]))
        .getOneOrFail();
    sortByField(list.blocks, 'index');
    return {
        title: list.title,
        blocks: await Promise.all(list.blocks.map(block => getBlockComp(block.id, actorId)))
    }   
}

async function createBlockTasksItem(taskUuid : string, index : number, blockTasks : ListBlockTasks, actorId : number) {
    await versionCheckAccessLevel(taskUuid, actorId, AccessType.read)
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
            body : await createLatexField(blockObj.body) 
        });
    }
}

async function createBlocks(blocksObj : ListBlockCreate[], list : List, actorId : number) : Promise<void>{
    return Promise.all(blocksObj.map((blocksObj, i) =>
        createBlock(blocksObj, i, list, actorId)
    )).then()
}

