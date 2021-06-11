import { inspect } from "util";
import { testTaskUuids } from "../processes/create-test-data";
import * as DS from "../services/draft-service";
import { inspectLog } from "./test";

export async function testDraftService() {
    const draftId : number = await DS.createDraft(1, "Первый черновик");
    await DS.insertCommentBlock(draftId, "Первый комментарий", 0);
    await new Promise<void>((res, rej) => {
        DS.insertCommentBlock(draftId, "Сразу третий блок", 3)
            .then(() => {
                rej("Должна быть ошибка Out of range")
            })
            .catch((err) => {
                console.log(`Ошибка ${err.message} поймана`)
                res();
            })
    })
    await DS.insertTaskBlock(draftId, 1);
    await DS.insertCommentBlock(draftId, "Второй комментарий");
    
    const draft = await DS.draftGet(draftId, 1);
    console.log("Черновик получен");
    inspectLog(draft);
    await DS.moveBlock(draftId, 2, 0);
    inspectLog(await DS.draftGet(draftId, 1));
    await DS.removeBlock(draftId, 2);
    inspectLog(await DS.draftGet(draftId, 1));
}