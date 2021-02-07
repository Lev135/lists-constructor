import * as taskService  from "../services/task-service";
import * as materialService from "../services/material-service"
import * as types from "../types/task-types"
import { rootDir } from "../app";
import { getPdfPath } from "../latex";
import { Interface } from "readline";

export async function create(req : any, res : any, _next : any) {
    try {
        const body : types.PostCreateBody = req.body;
        const id : number = await taskService.createTask(req.user.id, body.task);
        if (body.userNote)
            await materialService.setUserNote(id, req.user.id, body.userNote);
        res.send( { id } as types.SendPostCreate );
    }
    catch (err) {
        console.log(err);
        res.send("Ошибка при обработке запроса: " + err.message);
    }
}

export async function viewPage(req : any, res : any) : Promise<void> {
    try {
        const query : types.GetViewPageQuery = req.query;
        const obj : types.RenderViewPage = {
            task : await taskService.getTaskMax(query.id),
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
        res.sendFile(
            await getPdfPath(
                query.id, 
                'task-template', 
                {}, 
                await taskService.getTaskMax(query.id)
            )
        );
    }
    catch (err) {
        console.log(err);
        res.send(`Ошибка при обработке запроса: ` + err.message);
    }
}
