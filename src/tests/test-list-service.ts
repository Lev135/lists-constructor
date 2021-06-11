import * as listService from '../services/list-service'
import { testTaskUuids, testThemeIds, testUserIds } from '../processes/create-test-data'
import { inspect } from 'util'
import { createMaterial } from '../services/material-service';

export async function testListService() {
    const { uuid }  = await listService.createList({
        title: 'list 1',
        blocks: [
            {
                body: {
                    body : "first text block",
                    packageUuids : []
                }
            },
            {
                taskUuids: [ testTaskUuids[0], testTaskUuids[1] ]
            },
            {
                body: {
                    body : "second text block",
                    packageUuids : []
                }
            },
            {
                taskUuids: [ testTaskUuids[1], testTaskUuids[0] ]
            }
        ],
        themeIds : [],
        packageUuids : []
    }, 1);
    
    console.log(uuid);
    const listMinObj : listService.ListMin = await listService.getListMin(uuid, 1);
    console.log('listMinObj', inspect(listMinObj, false, null, true));
    const listMaxObj : listService.ListMax = await listService.getListMax(uuid, 1);
    console.log('listMaxObj', inspect(listMaxObj, false, null, true));
}
