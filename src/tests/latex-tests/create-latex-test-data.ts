import { readdirSync, readFileSync } from "fs";
import { rootDir } from "../../app";
import { createList } from "../../services/list-service";
import { createMaterial } from "../../services/material-service";
import { createTask } from "../../services/task-service";

const taskStatementsDir = rootDir + '/src/tests/latex-tests/task-statements';

async function createLatexTasks() : Promise<number[]> {
    const fileNames : string[] = readdirSync(taskStatementsDir);
    const promises : Promise<number>[] = [];
    for (const fileName of fileNames) {
        const statement : string = readFileSync(taskStatementsDir + "/" + fileName).toString();
        console.log('statement', statement);
        const materialId : number = await createMaterial({
            authorId : 1,
            themeIds : []
        });
        promises.push(createTask(materialId, {
            statement : {
                body : statement,
                packageUuids : [],
            },
            answer : "",
            remarks : [],
            solutions : [],
        }));
    }
    return Promise.all(promises);
}

export async function createLatexTestData() {
    const ids : number[] = await createLatexTasks();
    const firstBlockIds = ids.slice();
    const secondBlockIds = ids.slice(1).reverse();
    const materialId : number = await createMaterial({
        authorId : 1,
        themeIds : []
    })
    await createList(materialId, {
        name : 'first \LaTeX list',
        blocks : [
            {
                body : {
                    body : `Все задачи по порядку: ${firstBlockIds.toString()}\\ldots`,
                    packageUuids : []
                }
            },
            {
                taskIds : firstBlockIds
            },
            {
                body : {
                    body : `А теперь в обратном порядке: $${secondBlockIds.toString()}$`,
                    packageUuids : []
                }
            },
            {
                taskIds : secondBlockIds
            },
            {
                body : {
                    body : `\\texttt{Да мы ещё и одну задачу где-то посеяли!}`,
                    packageUuids : []
                }
            }
        ]
    });
}