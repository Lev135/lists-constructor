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
import { AccessMax, checkAccessLevel } from "./access-service";
import { createLatexField, getLatexField, getLatexFieldComp, getPackageName, LatexFieldCompModel, LatexFieldGetModel, LatexFieldPostModel } from "./latex-service";
import { createMaterial, getMaterialMax, getMaterialMin, materialCheckAccessLevel } from "./material-service";
import { getTaskComp, getTaskMin } from "./task-service";
import { UserMin } from "./user-service";


export interface ListCreate extends ListCreateImpl {
    themeIds : number[],
    userNote ?: string
}

export async function createList(obj : ListCreate, actorId : number) : Promise<number> {
    return createMaterial({
        authorId : actorId, ...obj
    }).then(materialId => createListImpl(materialId, obj, actorId));
}

export interface ListMin extends ListMinImpl {
    author : UserMin;
//    owner : UserMin; TODO
}

export async function getListMin(id : number, actorId : number) : Promise<ListMin> {
    const material = await getMaterialMin(id, actorId);
    const list = await getListMinImpl(id);
    return {
        ...list,
        author : material.author,
    };
}

export interface ListMax extends ListMaxImpl {
    author : UserMin;
    themeIds : number[];
    creationDate : Date;
    userNote ?: string;
    accessRules : AccessMax;
}

export async function getListMax(id: number, actorId : number) : Promise<ListMax> {
    const material = await getMaterialMax(id, actorId);
    const list = await getListMaxImpl(id, actorId);
    return {
        ...material,
        ...list
    }
}

export interface ListComp extends ListComplImpl {
    packages : string[];
    author : UserMin;
}

export async function getListComp(id : number, actorId : number) : Promise<ListComp> {
    const material = await getMaterialMin(id, actorId);
    const listComp = await getListCompImpl(id, actorId);
    const packages : PackageName[] = await Promise.all(
        getListPackages({ ...listComp, author: material.author }).map(getPackageName)
    );
    
    return {
        ...listComp,
        packages,
        author : material.author
    };
}

// POST models:

async function createListImpl(materialId : number, obj : ListCreateImpl, actorId : number) : Promise<number> {
    const list : List = await getRepository(List).save({
        id: materialId,
        name: obj.name
    });
    await createBlocks(obj.blocks, list, actorId);
    return list.id;
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
                obj.blockTasks.taskItems.map(item => getTaskMin(item.task.id, actorId))
            )
        }
    }
    else {
        throw new Error("Unknown block type");
    }
}

async function getListMinImpl(id: number) : Promise<ListMinImpl> {
    try {
        const list : List = await createQueryBuilder(List, 'list')
            .where('list.id = :id', { id })
            .getOneOrFail();
        return {
            id : list.id,
            name : list.name,
        }
    }
    catch (err) {
        console.log(`Error while getting list min (id: ${id})`);
        throw err;
    }
}

async function getListMaxImpl(id : number, actorId : number) : Promise<ListMaxImpl> {
    try {
        const list : List = await createQueryBuilder(List, 'list')
            .where('list.id = :id', { id })
            .leftJoin('list.blocks', 'block')
                .addSelect(keysForSelection<ListBlock>('block', [ 'index' ]))
            .leftJoin('block.blockComment', 'blockComment')
                .addSelect(keysForSelection<ListBlockComment>('blockComment', ['bodyId']))
            .leftJoin('block.blockTasks', 'blockTasks')
                .addSelect(keysForSelection<ListBlockTasks>('blockTasks', [ 'id' ]))
            .leftJoin('blockTasks.taskItems', 'item')
                .addSelect(keysForSelection<ListBlockTaskItem>('item', [ 'index' ]))
            .leftJoin('item.task', 'task')
                .addSelect(keysForSelection<Task>('task', [ 'id' ]))
            .getOneOrFail();
        sortByField(list.blocks, 'index');
        return {
            id,
            name: list.name,
            blocks: await Promise.all(list.blocks.map(block => getBlock(block, actorId)))
        }
    }
    catch (err) {
        console.log(`Error while getting list max (id: ${id})`);
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
            .addSelect(keysForSelection<Task>('task', ['id']))
        .getOne();
    if (commentBlock) {
        return {
            body : await getLatexFieldComp(commentBlock.body.id)
        }
    }
    if (tasksBlock) {
        sortByField(tasksBlock.taskItems, 'index');
        return {
            tasks : await Promise.all(tasksBlock.taskItems.map(item => getTaskComp(item.task.id, actorId)))
        }
    }
    throw new Error("Unknown block type");
}

async function getListCompImpl(id : number, actorId : number) : Promise<ListComplImpl> {
    const list : List = await createQueryBuilder(List, 'list')
        .where('list.id = :id', { id })
        .leftJoin('list.blocks', 'block')
            .addSelect(keysForSelection<ListBlock>('block', [ 'id', 'index' ]))
        .getOneOrFail();
    sortByField(list.blocks, 'index');
    return {
        id,
        name: list.name,
        blocks: await Promise.all(list.blocks.map(block => getBlockComp(block.id, actorId)))
    }   
}

async function createBlockTasksItem(taskId : number, index : number, blockTasks : ListBlockTasks, actorId : number) {
    await materialCheckAccessLevel(taskId, actorId, AccessType.read)
    await getRepository(ListBlockTaskItem).save({
        block : blockTasks,
        index,
        taskId
    });
}

async function createBlock(blockObj : ListBlockCreate, index : number, list : List, actorId : number) {
    const block = await getRepository(ListBlock).save({ index, list });
    if ('taskIds' in blockObj) {
        const blockTasks = await getRepository(ListBlockTasks).save({ listBlock : block });
        await Promise.all(blockObj.taskIds.map((taskId, i) => 
            createBlockTasksItem(taskId, i, blockTasks, actorId)    
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

