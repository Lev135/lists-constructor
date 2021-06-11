import * as materialService from '../services/material-service';
import * as versionService from '../services/version-service';
import * as t from '../types/material-types';
import { processError, ReqT, ResT } from "../mlib";
import { AccessType } from '../entities/user-access';

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
    return materialService.materialCheckAccessLevel(req.query.id, req.user.id, AccessType.read)
        .then(_ => materialService.getMaterialAccess(req.query.id))
        .then(access => res.send(access))
        .catch(err => processError(err, res));
}

export async function setAccessRule(req : ReqT<t.PutAccessRulesQuery, t.PutAccessRulesBody>, res : ResT<void>) {
    // check is in function "setMaterialUserAccess"
    return materialService.setMaterialUserAccess(req.query.id, req.body.type, req.body.userId, req.user.id)
        .then(_ => res.send())
        .catch(err => processError(err, res));
}

export async function confirmVersion(req : ReqT<t.PutConfirmVersionQuery, void>, res : ResT<void>) {
    return versionService.confirmVersionCheck(req.query.uuid, req.user.id)
        .then(_ => versionService.confirmVersion(req.query.uuid, req.user.id))
        .then(_ => res.send())
        .catch(err => processError(err, res));
}
