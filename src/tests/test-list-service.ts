import * as listService from '../services/list-service'
import { testTaskIds, testThemeIds, testUserIds } from './create-test-data'

export async function testListService() {
    const listId : number = await listService.createList(testUserIds[0], {
        name: 'list 1',
        blocks: [
            {
                body: "first text block"
            },
            {
                taskIds: [ testTaskIds[0], testTaskIds[1] ]
            },
            {
                body: "second text block"
            },
            {
                taskIds: [ testTaskIds[1], testTaskIds[0] ]
            }
        ],
        themeIds: [ testThemeIds[1] ]
    });
    
    console.log(listId);
    const listMinObj : listService.ListGetMinModel = await listService.getListMin(listId);
    console.log('listMinObj', listMinObj);   
}