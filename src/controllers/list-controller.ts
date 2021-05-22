import { getListPackages, ListCompileModel } from "../compilation/compilation-types";
import { compilePdf } from "../compilation/index";
import { PackageName } from "../compilation/options/latex-language-types";
import { getPackageName } from "../services/latex-service";
import * as listService from "../services/list-service";
import * as materialService from '../services/material-service';
import * as types from '../types/list-types';
import { ReqT, ResT } from "./mlib-controllers";

export async function create(req : ReqT<void, types.PostCreateBody>, res : ResT<types.PostCreateSend>, _next : any) {
    try {
        const id : number = await materialService.createMaterial({
            authorId : req.user.id,
            themeIds : req.body.themeIds,
            userNote : req.body.userNote
        })
        await listService.createList(id, req.body);
        res.send({ id });
    }
    catch (err) {
        console.log(err);
        res.send("Ошибка при обработке запроса: " + err.message);
    }
}

export async function view(req : ReqT<types.GetViewQuery, void>,
                           res : ResT<types.GetViewSend>) : Promise<void> {
    try {
        const id : number = req.query.id;
        const material = await materialService.getMaterialMin(id, req.user.id);
        const list = await listService.getListMax(id);
        res.send({
            ...material,
            ...list,
        });
    }
    catch (err) {
        console.log(err);
        res.send(`Ошибка при обработке запроса (id = ${req.query.id}): ` + err.message);
    }
}

export async function compile(req : ReqT<types.PostCompileQuery, types.PostCompileBody>,
                              res : ResT<types.PostCompileSend>) {
    try {
        const id : number = req.query.id;
        const material : materialService.MaterialGetMinModel 
            = await materialService.getMaterialMin(id);
        const list : listService.ListCompModel 
            = await listService.getListCompile(id);
        const compObj : ListCompileModel = {
            ...list,
            author : material.author
        }
        const packages : PackageName[] = await Promise.all(
            getListPackages(compObj).map(uuid => getPackageName(uuid))
        );
        res.send({
            uuid : await compilePdf(
                id, 
                'list-template', 
                req.body, 
                { ...compObj, packages }
            )
        });
    }
    catch (err) {
        console.log(err);
        res.send(`Ошибка при обработке запроса компиляции (id = ${req.query.id}): ` + err.message);    
    }
}
