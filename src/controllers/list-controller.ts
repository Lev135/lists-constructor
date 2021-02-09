import { getPdfPath } from "../compilation/index";
import { GlobalOptions } from "../compilation/options/global-options";
import { Length } from "../compilation/options/tex-types";
import * as listService from "../services/list-service";
import * as materialService from '../services/material-service';
import * as types from '../types/list-types';

export async function create(req : any, res : any, _next : any) {
    try {
        const body : types.PostCreateBody = req.body;
        const id : number = await listService.createList(req.user.id, body.list);
        if (body.userNote)
            await materialService.setUserNote(id, req.user.id, body.userNote);
        res.send( { id } as types.SendPostCreate);
    }
    catch (err) {
        console.log(err);
        res.send("Ошибка при обработке запроса: " + err.message);
    }
}

export async function viewPage(req : any, res : any) : Promise<void> {
    try {
        const query : types.GetViewPageQuery = req.query;
        const obj : types.RenderViewPage = {
            list : await listService.getListMax(query.id),
            userNote : await materialService.getUserNote(query.id, req.user.id)
        };
        res.send(obj);
        //res.render('task/view-task.pug', task);
    }
    catch (err) {
        console.log(err);
        res.send(`Ошибка при обработке запроса (id = ${req.query.id}): ` + err.message);
    }
}

export async function viewPdf(req : any, res : any) {
    try {
        const query = req.query;
        const body : GlobalOptions = {
            page : {
                format : 'a4paper',
                margins : {
                    left : new Length(1, 'cm'),
                    right : new Length(1, 'cm'),
                    top : new Length(1, 'cm'),
                    bottom : new Length(1, 'cm'),
                    bindingoffset : new Length(0, 'pt')
                },
                orientation : "landscape",
                twoColumn : {
                    columnSep : new Length(1, 'cm'),
                    columnSepRule : new Length(2, 'pt')
                },
                pageNumbering : "Asbuk"
            },
            text : {
                mainTypeSize : "12pt"
            }
        }
        res.sendFile(
            await getPdfPath(
                query.id, 
                'list-template', 
                body, 
                await listService.getListMax(query.id)
            )
        );
    }
    catch (err) {
        console.log(err);
        res.send(`Ошибка при обработке запроса: ` + err.message);
    }
}
