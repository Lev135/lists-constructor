import * as userService from '../services/user-service'
import * as taskService from '../services/task-service' 
import * as themeService from '../services/theme-service'

export async function testTaskService() {
    const userId: number = await userService.registerUser({
        name: 'Name',
        surname: 'Surname',
        patronymic: 'Patronomyc',
        email: Date.now().toString(),
        password: 'password',
    });
    await themeService.clearThemes();
    await themeService.createThemeTrees([
        {
            name : "base 1",
            subThemes : [
                {
                    name : "theme 1.1",
                    subThemes : []
                },
                {
                    name : "theme 1.2",
                    subThemes : [
                        {
                            name : "subtheme 1.2.1",
                            subThemes : []
                        }
                    ]
                }
            ]
        },
        {
            name : "base 2",
            subThemes : []
        }
    ]);
    const themes = await themeService.getThemeTrees();
    console.log(themes);
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
        ],
        themeIds: [
            themes[1].id,
            themes[0].subThemes[1].subThemes[0].id
        ]
    });
    console.log("task created");
    const taskMin = await taskService.getTaskMin(taskId);
    console.log(taskMin);
    const taskMax = await taskService.getTaskMax(taskId);
    console.log(taskMax);
}