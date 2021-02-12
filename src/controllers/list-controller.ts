import { getListPackages, ListCompileModel } from "../compilation/compilation-types";
import { getPdfPath } from "../compilation/index";
import { GlobalOptions } from "../compilation/options/global-options";
import { Length } from "../compilation/options/latex-language-types";
import { getPackageName } from "../services/latex-service";
import * as listService from "../services/list-service";
import * as materialService from '../services/material-service';
import * as types from '../types/list-types';

export async function create(req : any, res : any, _next : any) {
    try {
        const body : types.PostCreateBody = req.body;
        const id : number = await materialService.createMaterial({
            authorId : req.user.id,
            themeIds : body.themeIds
        })
        if (body.userNote)
            await materialService.setUserNote(id, req.user.id, body.userNote);
        await listService.createList(id, body);
        const resObj : types.SendPostCreate = { id };
        res.send(resObj);
    }
    catch (err) {
        console.log(err);
        res.send("Ошибка при обработке запроса: " + err.message);
    }
}

export async function viewPage(req : any, res : any) : Promise<void> {
    try {
        const query : types.GetViewPageQuery = req.query;
        const material = await materialService.getMaterialMin(query.id);
        const list = await listService.getListMax(query.id);
        const userNote = await materialService.getUserNote(query.id, req.user.id);
        const obj : types.RenderViewPage = {
            ...material,
            ...list,
            userNote
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
        const material : materialService.MaterialGetMinModel 
            = await materialService.getMaterialMin(query.id);
        const list : listService.ListCompModel 
            = await listService.getListCompile(query.id);
        const compObj : ListCompileModel = {
            ...list,
            author : material.author
        }
        res.sendFile(
            await getPdfPath(
                query.id, 
                'list-template', 
                body, 
                {
                    ...compObj,
                    packages : await Promise.all(getListPackages(compObj).map(uuid => getPackageName(uuid)))
                }
            )
        );
    }
    catch (err) {
        console.log(err);
        res.send(`Ошибка при обработке запроса: ` + err.message);
    }
}
