import * as util  from 'util';
import * as taskService from '../services/task-service' 
import * as themeService from '../services/theme-service'
import { testTaskUuids } from '../processes/create-test-data';

export const logObject = (obj : any) => 
    console.log(util.inspect(obj, { depth : null, colors : true })); 

export async function testTaskService() {
    const taskId = testTaskUuids[0];
    const taskMin = await taskService.getTaskMin(taskId, 1);
    logObject(taskMin)
    const taskMax = await taskService.getTaskMax(taskId, 1);
    logObject(taskMax);
}