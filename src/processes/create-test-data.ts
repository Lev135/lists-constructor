import * as userService from '../services/user-service'
import * as themeService from '../services/theme-service'
import * as taskService from '../services/task-service' 
import { getRepository } from 'typeorm';
import { User } from '../entities/user';
import { addPackage, getPackages } from '../services/latex-service';

const testUserModels : userService.UserRegistration[] = [
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

const testTaskModels : taskService.TaskCreate[] = [
    {
        statement: "test statement",
        answer: "test answer",
        solutions: [
            {
                body : "first solution",
                packageUuids : []
            }, 
            {
                body : "second solution",
                packageUuids : []
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
        themeIds : [],
        userNote : "User Note",
        packageUuids : []
    },
    {
        statement: "2 statement",
        answer: "2 answer",
        solutions: [],
        remarks: [],
        themeIds : [],
        packageUuids : []
    },
    {
        statement: "Как набрать $\\frac{2 + 3}{5}$?",
        answer: " Привет, \\LaTeX!",
        solutions: [
            {
                body : "Набираешь \\verb|$\\frac{2 + 3}{5}$|",
                packageUuids : []
            }
        ],
        remarks: [],
        themeIds : [],
        userNote : "User note",
        packageUuids : []
    }
];
export let testTaskUuids : string[] = [];


async function registerTestUsers() {
    for (const model of testUserModels) {
        const user : User | undefined = await getRepository(User).findOne({where : { email : model.email }});
        if (user) {
            testTaskUuids.push();
        }
        else {
            testUserIds.push(await userService.registerUser(model));
        }
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
        testTaskUuids.push(await taskService.createTask(model, authorId).then(res => res.uuid));
    }
}

const testPackages = [
    'amssymb',
    'some-package'
]

async function addTestPackages() {
    console.log(testPackages);
    if ((await getPackages()).length === 0)
        return Promise.all(testPackages.map(addPackage));
}

export async function createTestData() {
    await registerTestUsers();
    await createTestThemes();
    await createTestTasks();
    await addTestPackages();
}