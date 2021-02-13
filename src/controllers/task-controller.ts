import * as taskService  from "../services/task-service";
import * as materialService from "../services/material-service"
import * as types from "../types/task-types"
import { rootDir } from "../app";
import { getPdfPath } from "../compilation/index";
import { Interface } from "readline";

export async function create(req : any, res : any, _next : any) {
    try {
        const body : types.PostCreateBody = req.body;
        const id : number = await materialService.createMaterial({
            authorId : req.user.id,
            themeIds : body.themeIds
        });
        if (body.userNote)
            await materialService.setUserNote(id, req.user.id, body.userNote);
        await taskService.createTask(id, body);
        const resObj : types.SendPostCreate = { id };
        res.send(resObj);
    }
    catch (err) {
        console.log(err);
        res.send("Ошибка при обработке запроса: " + err.message);
    }
}

export async function viewPage(req : any, res : any) : Promise<void> {
    try {
        const query : types.GetViewPageQuery = req.query;
        const task : taskService.TaskGetMaxModel = await taskService.getTaskMax(query.id);
        const material : materialService.MaterialGetMinModel = await materialService.getMaterialMin(query.id);
        const obj : types.RenderViewPage = {
            ...task,
            ...material,
            userNote : await materialService.getUserNote(query.id, req.user.id)
        };
        res.send(obj);
        //res.render('task/view-task.pug', task);
    }
    catch (err) {
        console.log(err);
        res.send(`Ошибка при обработке запроса (id = ${req.query.id}): ` + err.message);
    }
}

export async function viewPdf(req : any, res : any) {
    try {
        const query = req.query;
        throw new Error("Unrealized");
/*        res.sendFile(
            await getPdfPath(
                query.id, 
                'task-template', 
                {}, 
                await taskService.getTaskMax(query.id)
            )
        );*/
    }
    catch (err) {
        console.log(err);
        res.send(`Ошибка при обработке запроса: ` + err.message);
    }
}
