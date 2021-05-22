import * as taskService  from "../services/task-service";
import * as materialService from "../services/material-service"
import * as t from "../types/task-types"
import { ReqT, ResT } from "./mlib-controllers";

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
        const material = await materialService.getMaterialMin(id, req.user.id);
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
