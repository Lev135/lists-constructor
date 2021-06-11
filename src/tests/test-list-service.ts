import * as listService from '../services/list-service'
import { testTaskUuids, testThemeIds, testUserIds } from '../processes/create-test-data'
import { inspect } from 'util'
import { createMaterial } from '../services/material-service';

export async function testListService() {
    const { uuid }  = await listService.createList({
        list : {
            title: 'list 1',
            blocks: [
                {
                    body : "first text block",
                },
                {
                    taskUuids: [ testTaskUuids[0], testTaskUuids[1] ]
                },
                {
                    body : "second text block",
                },
                {
                    taskUuids: [ testTaskUuids[1], testTaskUuids[0] ]
                }
            ],
            packageUuids : []
        },
        material : {
            themeIds : []
        }
        
    }, 1);
    
    console.log(uuid);
    const listMinObj = await listService.getListMin(uuid, 1);
    console.log('listMinObj', inspect(listMinObj, false, null, true));
    const listMaxObj = await listService.getListMax(uuid, 1);
    console.log('listMaxObj', inspect(listMaxObj, false, null, true));
}
