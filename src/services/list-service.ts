import { keys } from "ts-transformer-keys";
import { createQueryBuilder, getRepository } from "typeorm";
import { List } from "../entities/list/list";
import { ListBlock } from "../entities/list/list-block";
import { ListBlockComment } from "../entities/list/list-block-comment";
import { ListBlockTaskItem } from "../entities/list/list-block-task-item";
import { ListBlockTasks } from "../entities/list/list-block-tasks";
import { Material } from "../entities/material/material";
import { Task } from "../entities/task/task";
import { User } from "../entities/user";
import { keysForSelection, pick } from "../mlib";
import { TaskGetMinModel } from "./task-service";
import { UserGetMinModel } from "./user-service";



// POST models:

export interface ListBlockCommentPostModel {
    body : string
}
export interface ListBlockTasksPostModel {
    taskIds : number[]
}
export type  ListBlockPostModel = ListBlockCommentPostModel | ListBlockTasksPostModel;
export interface ListPostCreateModel {
    name : string,
    blocks : ListBlockPostModel[],
    themeIds : number[]
};

async function createBlockTasksItem(taskId : number, index : number, blockTasks : ListBlockTasks) {
    const task : Task = await getRepository(Task).findOneOrFail(taskId);
    const blockTaskItem = getRepository(ListBlockTaskItem).create({ block : blockTasks, index, task });
    await getRepository(ListBlockTaskItem).save(blockTaskItem);
}

async function createBlock(blockObj : ListBlockPostModel, index : number, list : List) {
    const block = getRepository(ListBlock).create({ index, list });
    await getRepository(ListBlock).save(block);
    if ('taskIds' in blockObj) {
        const blockTasks = getRepository(ListBlockTasks).create({ listBlock : block });
        await getRepository(ListBlockTasks).save(blockTasks);
        const promises = [];
        for (let i = 0; i < blockObj.taskIds.length; ++i) {
            promises.push(createBlockTasksItem(blockObj.taskIds[i], i, blockTasks));
        }
        await Promise.all(promises);
    }
    else {
        const commentBlock = getRepository(ListBlockComment).create({ listBlock : block, body : blockObj.body});
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

export async function createList(authorId : number, obj : ListPostCreateModel) : Promise<number> {
    const author : User = await getRepository(User).findOneOrFail(authorId);
    const material : Material = getRepository(Material).create();
    material.author = author;
    await getRepository(Material).save(material);

    const list : List = getRepository(List).create({ name: obj.name, material });
    await getRepository(List).save(list);
    await Promise.all([
        createBlocks(obj.blocks, list),
        createQueryBuilder(Material).relation('themes').of(material).add(obj.themeIds)
    ]);

    return list.id;
}

export interface ListGetMinModel {
    id: number,
    author: UserGetMinModel,
    name: string,
    themeIds: number[]
}

export type ListBlockCommentGetModel = ListBlockCommentPostModel;
export interface ListBlockTasksGetModel {
    tasks: TaskGetMinModel[]
}
export type ListBlockGetModel = ListBlockCommentPostModel | ListBlockTasksPostModel;

export interface ListGetMaxModel extends ListGetMinModel{
    creationDate: Date,
    blocks: ListBlockGetModel[]
}

export async function getListMin(id: number) : Promise<ListGetMinModel> {
    try {
        const list : List = await createQueryBuilder(List, 'list')
            .where('list.id = :id', { id })
            .innerJoin('list.material', 'material')
                .addSelect('material.id')
            .innerJoin('material.author', 'author')
                .addSelect(keysForSelection('author', keys<UserGetMinModel>()))
            .leftJoin('material.themes', 'theme')
                .addSelect('theme.id')
            .getOneOrFail();
        console.log('list', list);
        return {
            id : list.id,
            author : pick(list.material.author, keys<UserGetMinModel>()),
            name : list.name,
            themeIds : list.material.themes.map(theme => theme.id)
        }
    }
    catch (err) {
        console.log(`Error while getting list min (id: ${id})`);
        throw err;
    }
}