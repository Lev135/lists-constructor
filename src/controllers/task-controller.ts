import * as taskService  from "../services/task-service";
import * as t from "../types/task-types"
import { processError, ReqT, ResT } from "./mlib-controllers";
import { compilePdf } from "../compilation/latex-compilation";

export async function create(req : ReqT<void, t.PostCreateBody>, res : ResT<t.PostCreateSend>, _ : any) {
    return taskService.createTask(req.body, req.user.id)
        .then(id => res.send({ id }))
        .catch(err => processError(err, res));
}

export async function viewPage(req : ReqT<t.GetViewQuery, void>, res : ResT<t.GetViewSend>) {
    return taskService.getTaskMax(req.query.id, req.user.id)
        .then(task => res.send(task))
        .catch(err => processError(err, res));
}

export async function compile(req : ReqT<t.PostCompileQuery, t.PostCompileBody>,
                              res : ResT<t.PostCompileSend>) {    
    const id = req.query.id;
    return taskService.getTaskComp(id, req.user.id)
        .then(taskComp => compilePdf(id, 'task-template', req.body, taskComp))
        .then(uuid => res.send({ uuid }))
        .catch(err => processError(err, res));
}

export async function remarkTypes(req : ReqT<void, void>, res : ResT<t.GetRemarkTypesSend>) {
    return taskService.getRemarkTypes()
        .then(types => res.send(types))
        .catch(err => processError(err, res));
}
