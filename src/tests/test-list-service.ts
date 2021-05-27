import * as listService from '../services/list-service'
import { testTaskIds, testThemeIds, testUserIds } from '../processes/create-test-data'
import { inspect } from 'util'
import { createMaterial } from '../services/material-service';

export async function testListService() {
    const listId : number = await listService.createList({
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
        ],
        themeIds : []
    }, 1);
    
    console.log(listId);
    const listMinObj : listService.ListMin = await listService.getListMin(listId, 1);
    console.log('listMinObj', inspect(listMinObj, false, null, true));
    const listMaxObj : listService.ListMax = await listService.getListMax(listId, 1);
    console.log('listMaxObj', inspect(listMaxObj, false, null, true));
}
