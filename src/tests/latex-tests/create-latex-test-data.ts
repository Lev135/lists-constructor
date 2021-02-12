import { readdirSync, readFileSync } from "fs";
import { rootDir } from "../../app";
import { createList } from "../../services/list-service";
import { createTask } from "../../services/task-service";

const taskStatementsDir = rootDir + '/src/tests/latex-tests/task-statements';

async function createLatexTasks() : Promise<number[]> {
    const fileNames : string[] = readdirSync(taskStatementsDir);
    const promises : Promise<number>[] = [];
    for (const fileName of fileNames) {
        const statement : string = readFileSync(taskStatementsDir + "/" + fileName).toString();
        console.log('statement', statement);
        promises.push(createTask(1, {
            statement : {
                body : statement,
                packageUUids : [],
            },
            answer : "",
            remarks : [],
            solutions : [],
            themeIds : []
        }));
    }
    return Promise.all(promises);
}

export async function createLatexTestData() {
    const ids : number[] = await createLatexTasks();
    const firstBlockIds = ids.slice();
    const secondBlockIds = ids.slice(1).reverse();
    await createList(1, {
        name : 'first \LaTeX list',
        themeIds : [],
        blocks : [
            {
                body : {
                    body : `Все задачи по порядку: ${firstBlockIds.toString()}\\ldots`,
                    packageUUids : []
                }
            },
            {
                taskIds : firstBlockIds
            },
            {
                body : {
                    body : `А теперь в обратном порядке: $${secondBlockIds.toString()}$`,
                    packageUUids : []
                }
            },
            {
                taskIds : secondBlockIds
            },
            {
                body : {
                    body : `\\texttt{Да мы ещё и одну задачу где-то посеяли!}`,
                    packageUUids : []
                }
            }
        ]
    });
}