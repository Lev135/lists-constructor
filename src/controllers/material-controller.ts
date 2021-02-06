import * as materialService from '../services/material-service';
import * as types from '../types/material-types';

export async function getUserNote(req : any, res : any) {
    try {
        const query : types.GetUserNoteQuery = req.query;
        const obj : types.SendUserNote = {
            note : await materialService.getUserNote(query.id, req.user.id)
        };
        res.send(obj);
    }
    catch (err) {
        console.log(err);
        res.send("Ошибка при обработке запроса: " + err.message);
    }
}

export async function setUserNote(req : any, res : any, _next : any) {
    try {
        const body : types.PostUserNoteBody = req.body;
        const query : types.PostUserNoteQuery = req.query;
        await materialService.setUserNote(query.id, req.user.id, body.note);
        res.send();
    }
    catch (err) {
        console.log(err);
        res.send("Ошибка при обработке запроса: " + err.message);
    }
}