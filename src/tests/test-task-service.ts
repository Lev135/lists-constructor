import * as util  from 'util';
import * as taskService from '../services/task-service' 
import * as themeService from '../services/theme-service'
import { testTaskIds } from './create-test-data';

export const logObject = (obj : any) => 
    console.log(util.inspect(obj, { depth : null, colors : true })); 

export async function testTaskService() {
    const taskId : number = testTaskIds[0];
    const taskMin = await taskService.getTaskMin(taskId);
    logObject(taskMin)
    const taskMax = await taskService.getTaskMax(taskId);
    logObject(taskMax);
}