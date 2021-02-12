import * as listService from '../services/list-service'
import { testTaskIds, testThemeIds, testUserIds } from './create-test-data'
import { inspect } from 'util'

export async function testListService() {
    const listId : number = await listService.createList(testUserIds[0], {
        name: 'list 1',
        blocks: [
            {
                body: {
                    body : "first text block",
                    packageUUids : []
                }
            },
            {
                taskIds: [ testTaskIds[0], testTaskIds[1] ]
            },
            {
                body: {
                    body : "second text block",
                    packageUUids : []
                }
            },
            {
                taskIds: [ testTaskIds[1], testTaskIds[0] ]
            }
        ],
        themeIds: [ testThemeIds[1] ]
    });
    
    console.log(listId);
    const listMinObj : listService.ListGetMinModel = await listService.getListMin(listId);
    console.log('listMinObj', inspect(listMinObj, false, null, true));
    const listMaxObj : listService.ListGetMaxModel = await listService.getListMax(listId);
    console.log('listMaxObj', inspect(listMaxObj, false, null, true));
}