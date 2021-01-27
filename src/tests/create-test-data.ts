import * as userService from '../services/user-service'
import * as themeService from '../services/theme-service'
import * as taskService from '../services/task-service' 

const testUserModels : userService.UserPostRegistrationModel[] = [
    {
        name: 'admin',
        surname: 'adminov',
        email: 'admin@a',
        password: 'admin',
    },
    {
        name: 'Елена',
        surname: 'Иванова',
        patronymic: 'Алекссеевна',
        email: 'elena@mail.ru',
        password: 'elena',
    },
    {
        name: 'Пётр',
        surname: 'Алексеев',
        email: 'petr@mail.ru',
        password: 'petr',
    }
];
export let testUserIds : number[] = [];

const testThemeTree : themeService.ThemePostCreateTreeModel[] = [
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
];
export let testThemeIds : number[] = [];

const testTaskModels : taskService.TaskPostCreateModel[] = [
    {
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
        themeIds : []
    },
    {
        statement: "2 statement",
        answer: "2 answer",
        solutions: [],
        remarks: [],
        themeIds: []
    }
];
export let testTaskIds : number[] = [];


async function registerTestUsers() {
    for (const model of testUserModels) {
        testUserIds.push(await userService.registerUser(model));
    }
}

async function createTestThemes() {
    await themeService.createThemeTrees(testThemeTree);
    const f = (node : themeService.ThemeGetTreeModel) => {
        testThemeIds.push(node.id);
        node.subThemes.forEach(f);
    };
    (await themeService.getThemeTrees()).forEach(f);
}

async function createTestTasks() {
    for (const model of testTaskModels) {
        const authorId : number = testUserIds[model.answer.length % testUserIds.length];
        model.themeIds.push(testThemeIds[model.statement.length % testThemeIds.length]);
        testTaskIds.push(await taskService.createTask(authorId, model));
    }
}

export async function createTestData() {
    await registerTestUsers();
    await createTestThemes();
    await createTestTasks();
}