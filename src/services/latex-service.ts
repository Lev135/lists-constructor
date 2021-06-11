import { createQueryBuilder, getRepository } from "typeorm";
import { PackageName } from "../compilation/options/latex-language-types";
import { LatexField } from "../entities/latex/latex-field";
import { LatexPackage } from "../entities/latex/latex-package";
import { keysForSelection } from "../mlib";

interface LatexFieldGetModelObj {
    body : string
}
export type LatexFieldGetModel = LatexFieldGetModelObj | string;

interface LatexFieldPostModelObj {
    // TODO : Вставка в LaTeX-поле картинок, таблиц и т. п.
    packageUuids ?: string[], 
    body : string
}
export type LatexFieldPostModel = LatexFieldPostModelObj | string

export interface LatexFieldCompModel {
    packageUuids : string[],
    body : string
}

function toGetObj(model : LatexFieldGetModel) : LatexFieldGetModelObj {
    return typeof(model) === "string" ? { body : model }
                                      : model;
}
function fromGetObj(obj : LatexFieldGetModelObj) : LatexFieldGetModel {
    return obj.body;
}

function toPostObj(model : LatexFieldPostModel) : LatexFieldPostModelObj {
    return typeof(model) === "string" 
                    ? { body : model }
                    :  model;
}
function fromPostObj(obj : LatexFieldPostModelObj) : LatexFieldPostModel {
    return obj.packageUuids && obj.packageUuids.length > 0 
                    ? obj 
                    : obj.body;
}

export async function createLatexField(model : LatexFieldPostModel ) : Promise<LatexField> {
    const obj = toPostObj(model);
    const res : LatexField = await getRepository(LatexField).save(obj);
    await addPackages(res.id, obj.packageUuids || []);
    return res;
}

export async function getLatexField(id : number) : Promise<LatexFieldGetModel> {
    return getRepository(LatexField).findOneOrFail(id)
                    .then(fromGetObj);
}

export async function getLatexFieldComp(id : number) : Promise<LatexFieldCompModel> {
    const field : LatexField = await createQueryBuilder(LatexField, 'field')
        .where({id})
        .leftJoin('field.packages', 'package')
            .addSelect(keysForSelection<LatexPackage>('package', ['uuid']))
        .getOneOrFail();
    return {
        body : field.body,
        packageUuids : field.packages.map(pack => pack.uuid)
    }
}

export function addPackages(latexFieldId : number, packageUuids : string[]) : Promise<void> {
    return createQueryBuilder(LatexField)
            .relation('packages')
            .of(latexFieldId)
            .add(packageUuids);   
}

export async function getPackageName(packageUuid : string) : Promise<string> {
    const pack : LatexPackage = await getRepository(LatexPackage).findOneOrFail(packageUuid);
    return pack.name;
}

export interface PackageGetModel {
    uuid : string,
    name : string
}

export async function addPackage(packageName : string) : Promise<string> {
    return (await getRepository(LatexPackage).save({
        name : packageName,
    })).uuid;
}

export async function getPackages() : Promise<PackageGetModel[]> {
    return await createQueryBuilder(LatexPackage).getMany();
}

export async function packageCheckUuid(uuid : string) {
    return getRepository(LatexPackage)
        .findOne(uuid)
        .then(p => {
            if (!p)
                throw new Error (`Incorrect package uuid: "${uuid}"`);
        })
}