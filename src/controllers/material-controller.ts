import * as materialService from '../services/material-service';
import * as t from '../types/material-types';
import { processError, ReqT, ResT } from "../mlib";

export async function getUserNote(req : ReqT<t.GetUserNoteQuery, void>, res : ResT<t.GetUserNoteSend>) {
    return materialService.getUserNote(req.query.id, req.user.id)
        .then(note => res.send({ note }))
        .catch(err => processError(err, res));
}

export async function setUserNote(req : ReqT<t.PostUserNoteQuery, t.PostUserNoteBody>, res : ResT<void>, _ : any) {
    return materialService.setUserNote(req.query.id, req.user.id, req.body.note)
        .then(() => res.send())
        .catch(err => processError(err, res));
}

export async function getAccessRules(req : ReqT<t.GetAccessRulesQuery, void>, res : ResT<t.GetAccessRulesSend>) {
    return materialService.getMaterialAccess(req.query.id, req.user.id)
        .then(access => res.send(access))
        .catch(err => processError(err, res));
}

export async function setAccessRule(req : ReqT<t.PutAccessRulesQuery, t.PutAccessRulesBody>, res : ResT<void>) {
    return materialService.setMaterialUserAccess(req.query.id, req.body.type, req.body.userId, req.user.id)
        .then(_ => res.send())
        .catch(err => processError(err, res))
}
