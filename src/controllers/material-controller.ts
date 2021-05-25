import * as materialService from '../services/material-service';
import * as t from '../types/material-types';
import { processError, ReqT, ResT } from './mlib-controllers';

export async function getUserNote(req : ReqT<t.GetUserNoteQuery, void>, res : ResT<t.GetUserNoteSend>) {
    try {
        res.send({
            note : await materialService.getUserNote(req.query.id, req.user.id)
        });
    }
    catch (err) {
        console.log(err);
        res.send("Ошибка при обработке запроса: " + err.message);
    }
}

export async function setUserNote(req : ReqT<t.PostUserNoteQuery, t.PostUserNoteBody>, res : ResT<void>, _ : any) {
    try {
        await materialService.setUserNote(req.query.id, req.user.id, req.body.note);
        res.send();
    }
    catch (err) {
        console.log(err);
        res.send("Ошибка при обработке запроса: " + err.message);
    }
}

export async function getAccessRules(req : ReqT<t.GetAccessRulesQuery, void>, res : ResT<t.GetAccessRulesSend>) {
    materialService.getMaterialAccess(req.query.id, req.user.id)
        .then(access => res.send(access))
        .catch(err => processError(err, res));
}

export async function setAccessRule(req : ReqT<t.PutAccessRulesQuery, t.PutAccessRulesBody>, res : ResT<void>) {
    return materialService.setMaterialUserAccess(req.query.id, req.body.type, req.body.userId, req.user.id)
                    .then(_ => res.send())
                    .catch(err => processError(err, res))
}
