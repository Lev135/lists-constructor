import { createList, getListMax, ListGetMaxModel, ListPostCreateModel } from "../services/list-service";

export async function create(req : any, res : any, _next : any) {
    try {
        const listObj : ListPostCreateModel = req.body;
        const id : number = await createList(req.user.id, listObj);
        res.send( { id } );
    }
    catch (err) {
        console.log(err);
        res.send("Ошибка при обработке запроса: " + err.message);
    }
}

export async function viewPage(req : any, res : any) : Promise<void> {
    try {
        const list : ListGetMaxModel = await getListMax(req.body.id);
        res.send(list);
        //res.render('task/view-task.pug', task);
    }
    catch (err) {
        console.log(err);
        res.send(`Ошибка при обработке запроса (id = ${req.body.id}): ` + err.message);
    }
}