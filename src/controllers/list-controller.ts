import * as listService from "../services/list-service";
import * as materialService from '../services/material-service';
import * as types from '../types/list-types';

export async function create(req : any, res : any, _next : any) {
    try {
        const body : types.PostCreate = req.body;
        const id : number = await listService.createList(req.user.id, body.list);
        if (body.userNote)
            await materialService.setUserNote(id, req.user.id, body.userNote);
        res.send( { id } as types.SendPostCreate);
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
            list : await listService.getListMax(body.id),
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