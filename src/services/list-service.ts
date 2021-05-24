import { createQueryBuilder, getRepository } from "typeorm";
import { LatexField } from "../entities/latex/latex-field";
import { List } from "../entities/list/list";
import { ListBlock } from "../entities/list/list-block";
import { ListBlockComment } from "../entities/list/list-block-comment";
import { ListBlockTaskItem } from "../entities/list/list-block-task-item";
import { ListBlockTasks } from "../entities/list/list-block-tasks";
import { Task } from "../entities/task/task";
import { keysForSelection, sortByField } from "../mlib";
import { createLatexField, getLatexField, getLatexFieldComp, LatexFieldCompModel, LatexFieldGetModel, LatexFieldPostModel } from "./latex-service";
import { getTaskComp, getTaskMin, TaskCompModel, TaskGetMinModel } from "./task-service";

// POST models:

export interface ListBlockCommentPostModel {
    body : LatexFieldPostModel
}
export interface ListBlockTasksPostModel {
    taskIds : number[]
}
export type  ListBlockPostModel = ListBlockCommentPostModel | ListBlockTasksPostModel;
export interface ListPostCreateModel {
    name : string,
    blocks : ListBlockPostModel[],
};

async function createBlockTasksItem(taskId : number, index : number, blockTasks : ListBlockTasks) {
    await getRepository(ListBlockTaskItem).save({
        block : blockTasks,
        index,
        taskId
    });
}

async function createBlock(blockObj : ListBlockPostModel, index : number, list : List) {
    const block = getRepository(ListBlock).create({ index, list });
    await getRepository(ListBlock).save(block);
    if ('taskIds' in blockObj) {
        const blockTasks = await getRepository(ListBlockTasks).save({ listBlock : block });
        const promises = [];
        for (let i = 0; i < blockObj.taskIds.length; ++i) {
            promises.push(createBlockTasksItem(blockObj.taskIds[i], i, blockTasks));
        }
        await Promise.all(promises);
    }
    else {
        const commentBlock = getRepository(ListBlockComment).create({
            listBlock : block, 
            body : await createLatexField(blockObj.body) 
        });
        await getRepository(ListBlockComment).save(commentBlock);
    }
}

async function createBlocks(blocksObj : ListBlockPostModel[], list : List) {
    const promises = [];
    for (let i = 0; i < blocksObj.length; ++i) {
        promises.push(createBlock(blocksObj[i], i, list));
    }
    await Promise.all(promises);
}

export async function createList(materialId : number, obj : ListPostCreateModel) : Promise<number> {
    const list : List = await getRepository(List).save({ id: materialId, name: obj.name });
    await Promise.all([
        createBlocks(obj.blocks, list),
    ]);

    return list.id;
}

export interface ListGetMinModel {
    id: number,
    name: string,
}

export interface ListBlockCommentGetModel {
    body : LatexFieldGetModel
}

export interface ListBlockTasksGetModel {
    tasks: TaskGetMinModel[]
}
export type ListBlockGetModel = ListBlockCommentGetModel | ListBlockTasksGetModel;

export interface ListGetMaxModel extends ListGetMinModel{
    blocks: ListBlockGetModel[]
}


export interface ListBlockTasksCompModel {
    tasks: TaskCompModel[]
}

export interface ListBlockCommentCompModel {
    body : LatexFieldCompModel
}

export type ListBlockCompModel = ListBlockCommentCompModel | ListBlockTasksCompModel;

export interface ListCompModel extends ListGetMinModel {
    blocks: ListBlockCompModel[]
}

export async function getBlock(obj : ListBlock) : Promise<ListBlockGetModel> {
    if (obj.blockComment) {
        return {
            body : await getLatexField(obj.blockComment.bodyId)
        }
    }
    else if (obj.blockTasks) {
        return {
            tasks : await Promise.all(
                obj.blockTasks.taskItems.map(item => getTaskMin(item.task.id))
            )
        }
    }
    else {
        throw new Error("Unknown block type");
    }
}

export async function getListMin(id: number) : Promise<ListGetMinModel> {
    try {
        const list : List = await createQueryBuilder(List, 'list')
            .where('list.id = :id', { id })
            .getOneOrFail();
        console.log('list', list);
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

export async function getListMax(id : number) : Promise<ListGetMaxModel> {
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
            blocks: await Promise.all(list.blocks.map(block => getBlock(block)))
        }
    }
    catch (err) {
        console.log(`Error while getting list max (id: ${id})`);
        throw err;
    }
}

async function getBlockComp(blockId : number) : Promise<ListBlockCompModel> {
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
            tasks : await Promise.all(tasksBlock.taskItems.map(item => getTaskComp(item.task.id)))
        }
    }
    throw new Error("Unknown block type");
}

export async function getListCompile(id : number) : Promise<ListCompModel> {
    const list : List = await createQueryBuilder(List, 'list')
        .where('list.id = :id', { id })
        .leftJoin('list.blocks', 'block')
            .addSelect(keysForSelection<ListBlock>('block', [ 'id', 'index' ]))
        .getOneOrFail();
    console.log('list', list);
    return {
        id,
        name: list.name,
        blocks: await Promise.all(sortByField(list.blocks, 'index').map(block => getBlockComp(block.id)))
    }   
}
