import { createQueryBuilder, getRepository } from "typeorm";
import { Draft } from "../entities/draft/draft";
import { getUser, UserMin } from "./user-service";
import { DraftBlockComment } from '../entities/draft/draft-block-comment'
import { DraftBlock } from "../entities/draft/draft-block";
import { DraftBlockTask } from "../entities/draft/draft-block-task";
import { Task } from "../entities/task/task";
import { getTaskMin, TaskMin } from "./task-service";
import { keysForSelection, sortByField } from "../mlib";
import { keys } from "ts-transformer-keys";
import { User } from "../entities/user";

export async function getDraft(draftId : number) : Promise<Draft> {
    return getRepository(Draft).findOneOrFail(draftId);
}

export async function createDraft(userId : number, name : string) : Promise<number> {
    const draft = await createQueryBuilder(Draft)
        .insert().values({
            name, owner : await getUser(userId)
        })
        .execute();
    return draft.identifiers[0].id;
} 

async function countBlocks(draftId : number) : Promise<number> {
    return createQueryBuilder(DraftBlock)
        .where('draftId = :draftId', { draftId })
        .getCount();
}

async function shift(draftId : number, begin : number, end : number, direction : '+' | '-') {
    createQueryBuilder(DraftBlock)
        .where('draftId = :draftId AND index >= :begin AND index < :end',
            { draftId, begin, end })
        .update().set({ 
            index : () => `\`index\` ${direction} 1`
        })
        .execute();
}

async function insertBaseBlock(draft : Draft, index ?: number) : Promise<DraftBlock> {
    const size : number = await countBlocks(draft.id);
    if (!index)
        index = size;
    if (!(0 <= index && index <= size)) {
        throw new Error("Index out of range");
    }
    await shift(draft.id, index, size, '+');
    return getRepository(DraftBlock).save({
        draft,
        index
    });
}

export async function insertCommentBlock(draftId : number, body : string, index ?: number) {
    const draft : Draft = await getDraft(draftId);
    const block : DraftBlock = await insertBaseBlock(draft, index);
    await getRepository(DraftBlockComment).save({
        block,
        body
    });
}

export async function insertTaskBlock(draftId : number, taskId : number, index? : number) {
    const draft : Draft = await getDraft(draftId);
    const block : DraftBlock = await insertBaseBlock(draft, index);
    await getRepository(DraftBlockTask).save({
        block,
        task : await getRepository(Task).findOneOrFail(taskId)
    });
}

function createBlockQuery(draftId : number, index : number) {
    return createQueryBuilder(DraftBlock)
        .where('draftId = :draftId AND index = :index', { draftId, index });
}

export async function removeBlock(draftId : number, index : number) : Promise <void> {
    const count : number = await countBlocks(draftId);
    if (!(0 <= index && index < count)) {
        throw new Error("Index out of range");
    }
    await createBlockQuery(draftId, index)
        .delete()
        .execute();
    await shift(draftId, index, count, '-')
}

async function getBaseBlock(draftId : number, index : number) : Promise<DraftBlock> {
    return createBlockQuery(draftId, index)
        .getOneOrFail();
}

export async function updateCommentBlock(draftId : number, body : string, index : number) {
    const block : DraftBlock = await getBaseBlock(draftId, index);
    await createQueryBuilder(DraftBlockComment)
        .where("id = :id", { id : block.id })
        .update({ body })
        .execute();
}

export async function moveBlock(draftId : number, index : number, newIndex : number) {
    const size : number = await countBlocks(draftId);
    if (!(0 <= index && index < size && 0 <= newIndex && newIndex < size)) {
        throw new Error("Index out of range");
    }
    await createBlockQuery(draftId, index) 
        .update().set({
            index : size
        })
        .execute();
    if (index < newIndex) {
        await shift(draftId, index + 1, newIndex + 1, '-');
    }
    else {
        await shift(draftId, newIndex, index, '+');
    }
    await createBlockQuery(draftId, size)
        .update().set({
            index : newIndex
        })
        .execute();
}

export type DraftBlockCommentModel = string;
export type DraftBlockTaskGetModel = TaskMin;
export type DraftBlockTaskPostModel = number;

export type DraftBlockGetModel = DraftBlockCommentModel | DraftBlockTaskGetModel;
export type DraftBlockPostModel = DraftBlockCommentModel | DraftBlockTaskPostModel;

export interface DraftGetModel {
    name : string,
    owner : UserMin,
    blocks : DraftBlockGetModel[]
}
export interface DraftPostModel {
    name : string,
    blocks : DraftBlockPostModel[]
}

async function blockGet(abstractBlock : DraftBlock, actorId : number) : Promise<DraftBlockGetModel>{
    const commentBlock  = await getRepository(DraftBlockComment)
        .findOne(abstractBlock.id);
    if (commentBlock) {
        return commentBlock.body;
    }
    const { taskId  } = await createQueryBuilder(DraftBlockTask)
        .where("id = :id", { id : abstractBlock.id })
        .select('taskId')
        .getRawOne();
    return getTaskMin(taskId, actorId);
}

export async function draftGet(draftId : number, actorId : number) : Promise<DraftGetModel> {
    const draft : Draft = await createQueryBuilder(Draft, 'draft')
        .where('draft.id = :id', { id : draftId })
        .leftJoin('draft.blocks', 'block')
            .addSelect(keysForSelection<DraftBlock>('block', [ 'id', 'index' ]))
        .leftJoin('draft.owner', 'user')
            .addSelect(keysForSelection<User>('user', keys<UserMin>()))
        .getOneOrFail();
    sortByField(draft.blocks, 'index');
    const blocks = await Promise.all(draft.blocks.map(block => blockGet(block, actorId)));
    return {
        name : draft.name,
        owner : draft.owner,
        blocks
    }
}