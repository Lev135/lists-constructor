import { inspect } from "util";
import { getTaskMax, TaskGetMaxModel, TaskPostCreateModel, createTask } from "../services/task-service";

export async function create(req : any, res : any, _next : any) {
    try {
        const taskObj : TaskPostCreateModel = req.body;
        const id : number = await createTask(req.user.id, taskObj);           
        res.send( { id } );
    }
    catch (err) {
        console.log(err);
        res.send("Ошибка при обработке запроса: " + err.message);
    }
}

export async function viewPage(req : any, res : any) : Promise<void> {
    console.log(inspect(req.body, false, null, true));
    try {
        const task : TaskGetMaxModel = await getTaskMax(req.body.id);
        res.send(task);
        //res.render('task/view-task.pug', task);
    }
    catch (err) {
        console.log(err);
        res.send(`Ошибка при обработке запроса (id = ${req.body.id}): ` + err.message);
    }
}