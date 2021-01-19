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
    console.log(`id: ${userId}`);
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
        notes: [ {
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
    console.log(await taskService.getTaskMin(taskId));
    console.log(await taskService.getTaskMax(taskId));
}