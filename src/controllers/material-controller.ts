import * as materialService from '../services/material-service';
import * as t from '../types/material-types';
import { ReqT, ResT } from './mlib-controllers';

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