import { compilePdf } from "../compilation/latex-compilation";
import * as listService from "../services/list-service";
import * as types from '../types/list-types';
import { processError, ReqT, ResT } from "../mlib";

export async function create(req : ReqT<void, types.PostCreateBody>, res : ResT<types.PostCreateSend>, _next : any) {
    return listService.createList(req.body, req.user.id)
        .then(id => res.send({ id }))
        .catch(err => processError(err, res));
}

export async function view(req : ReqT<types.GetViewQuery, void>,
                           res : ResT<types.GetViewSend>) : Promise<void> {
    return listService.getListMax(req.query.id, req.user.id)
        .then(list => res.send(list))
        .catch(err => processError(err, res));
}

export async function compile(req : ReqT<types.PostCompileQuery, types.PostCompileBody>,
                              res : ResT<types.PostCompileSend>) {
    const id = req.query.id;
    return listService.getListComp(id, req.user.id)
        .then(listComp => compilePdf(id, 'list-template', req.body, listComp))
        .then(uuid => res.send({ uuid }))
        .catch(err => processError(err, res));
}
