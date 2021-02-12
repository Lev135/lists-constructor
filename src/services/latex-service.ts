import { createQueryBuilder, getRepository } from "typeorm";
import { PackageName } from "../compilation/options/tex-types";
import { LatexField } from "../entities/latex/latex-field";
import { LatexPackage } from "../entities/latex/latex-package";

export interface LatexFieldGetModel {
    body : string
}

export interface LatexFieldPostModel {
    // TODO : Вставка в LaTeX-поле картинок, таблиц и т. п.
    packageUuids : string[], 
    body : string
}

export interface LatexFieldCompModel {
    packageUuids : string[],
    body : string
}

export async function createLatexField(model : LatexFieldPostModel) : Promise<LatexField> {
    const res : LatexField = await getRepository(LatexField).save({ body : model.body });
    await addPackages(res.id, model.packageUuids);
    return res;
}

export function addPackages(latexFieldId : number, packageUuids : string[]) : Promise<void> {
    return createQueryBuilder(LatexField)
            .relation('packages')
            .of(latexFieldId)
            .add(packageUuids);   
}
