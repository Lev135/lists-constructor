import * as taskService from '../services/task-service' 
import * as themeService from '../services/theme-service'
import { testTaskIds } from './create-test-data';

export async function testTaskService() {
    const taskId : number = testTaskIds[0];
    const taskMin = await taskService.getTaskMin(taskId);
    console.log(taskMin);
    const taskMax = await taskService.getTaskMax(taskId);
    console.log(taskMax);
}