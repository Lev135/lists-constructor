import * as userService from '../services/user-service'
import * as taskService from '../services/task-service' 

export async function testTaskService() {
    const userId: number = await userService.registerUser({
        name: 'Name',
        surname: 'Surname',
        patronymic: 'Patronomyc',
        email: Date.now().toString(),
        password: 'password',
    });
    const taskId : number = await taskService.createTask(userId, {
        statement: "test statement",
        answer: "test answer",
        solutions: [ {
                body: "first solution",
                grade: 1
            }, {
                body: "second solution",
                grade: 2
            }
        ],
        remarks: [ {
                type: "1 note type",
                label: "1 note",
                body: "first note",
            }, {
                type: "2 note type",
                label: "2 note",
                body: "second note"
            }
        ]
    });
    const taskMin = await taskService.getTaskMin(taskId);
    console.log(taskMin);
    const taskMax = await taskService.getTaskMax(taskId);
    console.log(taskMax);
}