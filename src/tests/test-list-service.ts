import * as listService from '../services/list-service'
import { testTaskIds, testThemeIds, testUserIds } from '../processes/create-test-data'
import { inspect } from 'util'
import { createMaterial } from '../services/material-service';

export async function testListService() {
    const materialId : number = await createMaterial({
        authorId : testUserIds[0],
        themeIds : []
    })
    const listId : number = await listService.createList(materialId, {
        name: 'list 1',
        blocks: [
            {
                body: {
                    body : "first text block",
                    packageUuids : []
                }
            },
            {
                taskIds: [ testTaskIds[0], testTaskIds[1] ]
            },
            {
                body: {
                    body : "second text block",
                    packageUuids : []
                }
            },
            {
                taskIds: [ testTaskIds[1], testTaskIds[0] ]
            }
        ]
    });
    
    console.log(listId);
    const listMinObj : listService.ListGetMinModel = await listService.getListMin(listId);
    console.log('listMinObj', inspect(listMinObj, false, null, true));
    const listMaxObj : listService.ListGetMaxModel = await listService.getListMax(listId);
    console.log('listMaxObj', inspect(listMaxObj, false, null, true));
}