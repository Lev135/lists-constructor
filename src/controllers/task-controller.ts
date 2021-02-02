import * as taskService  from "../services/task-service";
import * as materialService from "../services/material-service"
import * as types from "../types/task-types"

export async function create(req : any, res : any, _next : any) {
    try {
        const body : types.PostCreate = req.body;
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
        const body : types.GetViewPage = req.body;
        const obj : types.RenderViewPage = {
            task : await taskService.getTaskMax(body.id),
            userNote : await materialService.getUserNote(body.id, req.user.id)
        };
        res.send(obj);
        //res.render('task/view-task.pug', task);
    }
    catch (err) {
        console.log(err);
        res.send(`Ошибка при обработке запроса (id = ${req.body.id}): ` + err.message);
    }
}