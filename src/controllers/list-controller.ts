import { compilePdf } from "../compilation/latex-compilation";
import * as listService from "../services/list-service";
import * as t from '../types/list-types';
import { processError, ReqT, ResT } from "../mlib";

export async function create(req : ReqT<void, t.PostCreateBody>, res : ResT<t.PostCreateSend>, _next : any) {
    return listService.createList(req.body, req.user.id)
        .then(ids => res.send(ids))
        .catch(err => processError(err, res));
}

export async function edit(req : ReqT<t.PutEditQuery, t.PutEditBody>, res : ResT<t.PutEditSend>) {
    return listService.editList(req.query.uuid, req.body, req.user.id)
        .then(ids => res.send(ids))
        .catch(err => processError(err, res));
}

export async function view(req : ReqT<t.GetViewQuery, void>,
                           res : ResT<t.GetViewSend>) : Promise<void> {
    return listService.getListMax(req.query.uuid, req.user.id)
        .then(list => res.send(list))
        .catch(err => processError(err, res));
}

export async function compile(req : ReqT<t.PostCompileQuery, t.PostCompileBody>,
                              res : ResT<t.PostCompileSend>) {
    const uuid = req.query.uuid;
    return listService.getListComp(uuid, req.user.id)
        .then(listComp => compilePdf(uuid, 'list-template', req.body, listComp))
        .then(uuid => res.send({ uuid }))
        .catch(err => processError(err, res));
}
