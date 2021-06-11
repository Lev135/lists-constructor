import { readdirSync, readFileSync } from "fs";
import { rootDir } from "../../app";
import { createList } from "../../services/list-service";
import { createMaterial } from "../../services/material-service";
import { createTask } from "../../services/task-service";

const taskStatementsDir = rootDir + '/src/tests/latex-tests/task-statements';

async function createLatexTasks() : Promise<string[]> {
    const fileNames : string[] = readdirSync(taskStatementsDir);
    const promises : Promise<string>[] = [];
    for (const fileName of fileNames) {
        const statement : string = readFileSync(taskStatementsDir + "/" + fileName).toString();
        promises.push(createTask({
            task : {
                statement,
                answer : "",
                remarks : [],
                solutions : [],
                packageUuids : []
            },
            material : {
                themeIds : []
            }
        }, 1).then(res => res.uuid));
    }
    return Promise.all(promises);
}

export async function createLatexTestData() {
    const uuids : string[] = await createLatexTasks();
    const firstBlockIds = uuids.slice();
    const secondBlockIds = uuids.slice(1).reverse();
    await createList({
        list : {
            title : 'first \LaTeX list',
            blocks : [
                {
                    body : `Все задачи по порядку: ${firstBlockIds.toString()}\\ldots`,
                },
                {
                    taskUuids : firstBlockIds
                },
                {
                    body : `А теперь в обратном порядке: $${secondBlockIds.toString()}$`,
                    
                },
                {
                    taskUuids : secondBlockIds
                },
                {
                    body : `\\texttt{Да мы ещё и одну задачу где-то посеяли!}`,
                }
            ],
            packageUuids : [],
        },
        material : {
            themeIds : []
        }
    }, 1);
}