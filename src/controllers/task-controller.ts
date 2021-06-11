import * as taskService  from "../services/task-service";
import * as t from "../types/task-types"
import { processError, ReqT, ResT } from "../mlib";
import { compilePdf } from "../compilation/latex-compilation";

export async function create(req : ReqT<void, t.PostCreateBody>, res : ResT<t.PostCreateSend>, _ : any) {
    return taskService.createTask(req.body, req.user.id)
        .then(obj => res.send(obj))
        .catch(err => processError(err, res));
}

export async function viewPage(req : ReqT<t.GetViewQuery, void>, res : ResT<t.GetViewSend>) {
    return taskService.getTaskMax(req.query.uuid, req.user.id)
        .then(task => res.send(task))
        .catch(err => processError(err, res));
}

export async function edit(req : ReqT<t.PutEditQuery, t.PutEditBody>, res : ResT<t.PutEditSend>) {
    return taskService.editTask(req.query.uuid, req.body, req.user.id)
        .then(ids => res.send(ids))
        .catch(err => processError(err, res));
}

export async function compile(req : ReqT<t.PostCompileQuery, t.PostCompileBody>,
                              res : ResT<t.PostCompileSend>) {    
    const id = req.query.uuid;
    return taskService.getTaskComp(id, req.user.id)
        .then(async taskComp => compilePdf(taskComp.uuid, 'task-template', req.body, taskComp))
        .then(uuid => res.send({ uuid }))
        .catch(err => processError(err, res));
}

export async function remarkTypes(req : ReqT<void, void>, res : ResT<t.GetRemarkTypesSend>) {
    return taskService.getRemarkTypes()
        .then(types => res.send(types))
        .catch(err => processError(err, res));
}
