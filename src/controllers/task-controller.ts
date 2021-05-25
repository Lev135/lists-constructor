import * as taskService  from "../services/task-service";
import * as materialService from "../services/material-service"
import * as t from "../types/task-types"
import { ReqT, ResT } from "./mlib-controllers";
import { PackageName } from "../compilation/options/latex-language-types";
import { compilePdf } from "../compilation/latex-compilation";
import { getPackageName } from "../services/latex-service";

export async function create(req : ReqT<void, t.PostCreateBody>, res : ResT<t.PostCreateSend>, _ : any) {
    try {
        const id : number = await materialService.createMaterial({
            authorId : req.user.id,
            themeIds : req.body.themeIds,
            userNote : req.body.userNote
        });
        await taskService.createTask(id, req.body);
        res.send({ id });
    }
    catch (err) {
        console.log(err);
        res.send("Ошибка при обработке запроса: " + err.message);
    }
}

export async function viewPage(req : ReqT<t.GetViewQuery, void>, res : ResT<t.GetViewSend>) {
    try {
        const id = req.query.id;
        const material = await materialService.getMaterialMax(id, req.user.id);
        const task = await taskService.getTaskMax(id);
        res.send({
            ...task,
            ...material,
        });
    }
    catch (err) {
        console.log(err);
        res.send(`Ошибка при обработке запроса (id = ${req.query.id}): ` + err.message);
    }
}

export async function compile(req : ReqT<t.PostCompileQuery, t.PostCompileBody>,
                              res : ResT<t.PostCompileSend>) {
    try {
        const id  = req.query.id;
        const material = await materialService.getMaterialMin(id, req.user.id);
        const task = await taskService.getTaskComp(id);
        const compObj : taskService.TaskCompModel = {
            ...task
        }
        const packagePromises : Promise<PackageName>[] = 
            task.statement.packageUuids.map(uuid => getPackageName(uuid));
        task.solutions.forEach(sol => {
            packagePromises.push(...sol.packageUuids.map(uuid => getPackageName(uuid)));
        })
        res.send({
            uuid : await compilePdf(
                id, 
                'task-template', 
                req.body, 
                { ...compObj, packages: await Promise.all(packagePromises), author: material.author }
            )
        });
    }
    catch (err) {
        console.log(err);
        res.send(`Ошибка при обработке запроса компиляции (id = ${req.query.id}): ` + err.message);    
    }
}

export async function remarkTypes(req : ReqT<void, void>, res : ResT<t.GetRemarkTypesSend>) {
    try {
        res.send(await taskService.getRemarkTypes());
    }
    catch (err) {
        console.log(err);
        res.send(`Ошибка при обработке запроса: ` + err.message);    
    }
}
