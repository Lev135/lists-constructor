import { createQueryBuilder, getRepository } from "typeorm";
import { PackageName } from "../compilation/options/latex-language-types";
import { LatexField } from "../entities/latex/latex-field";
import { LatexPackage } from "../entities/latex/latex-package";
import { keysForSelection } from "../mlib";

export interface LatexFieldGetModel {
    body : string
}

export interface LatexFieldPostModel {
    // TODO : Вставка в LaTeX-поле картинок, таблиц и т. п.
    packageUuids ?: string[], 
    body : string
}

export interface LatexFieldCompModel {
    packageUuids : string[],
    body : string
}

export async function createLatexField(model : LatexFieldPostModel | string) : Promise<LatexField> {
    const body = typeof(model) === "string" ? model : model.body;
    const res : LatexField = await getRepository(LatexField).save({ body });
    if (typeof(model) !== "string" && model.packageUuids)
        await addPackages(res.id, model.packageUuids);
    return res;
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
