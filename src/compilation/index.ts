import { createQueryBuilder, getRepository } from 'typeorm';
import { PdfIndex } from '../entities/pdf-index';
import { mkdir } from 'fs/promises';
import { Material } from '../entities/material/material';
import { rootDir } from '../app';
import { generateTeX } from './process-tamplates';
import { compileTeX } from './latex'

export const pdfDir = rootDir + "\\pdf";
export const templateDir = rootDir + "\\latex-templates";

const pdfFolder = (recordUuid : string) => `${pdfDir}\\${recordUuid}`;
const texFilePath = (recordUuid : string) => `${pdfFolder(recordUuid)}\\${recordUuid}.tex`
const pdfFilePath = (recordUuid : string) => `${pdfFolder(recordUuid)}\\${recordUuid}.pdf`;

async function createPdfFile(compilableId : number,
                             templateName : string,
                             templatePars : any,
                             obj : any) : Promise<string> {
    const templateParsJSON : string = JSON.stringify(templatePars);
    const newRecord : PdfIndex = await getRepository(PdfIndex).save({
        compilable : await getRepository(Material).findOneOrFail(compilableId),
        templateName,
        templateParsJSON
    });

    await mkdir(pdfFolder(newRecord.uuid), { recursive : true });
    await generateTeX(texFilePath(newRecord.uuid), templateName, templatePars, obj);
    const exitCode = await compileTeX(texFilePath(newRecord.uuid), pdfFolder(newRecord.uuid));
    if (exitCode != 0) {
        throw new Error(`Компиляция завершилась с кодом ${exitCode}`);
    }
    return newRecord.uuid;
}

export async function compilePdf(compilableId : number,
                                templateName : string,
                                templatePars : any,
                                obj : any) : Promise<string> {
    const templateParsJSON : string = JSON.stringify(templatePars);
    const record : PdfIndex | undefined = await createQueryBuilder(PdfIndex, 'pdf_index')
        .where('pdf_index.compilableId = :compilableId', { compilableId })
        .andWhere('pdf_index.templateName = :templateName', { templateName })
        .andWhere('pdf_index.templateParsJSON = :templateParsJSON', { templateParsJSON })
        .getOne(); 
    if (record) {
        return record.uuid; 
    }
    else {
        return createPdfFile(compilableId, templateName, templatePars, obj);
    }
}

export async function getPdfPath(uuid : string) : Promise<string | null> {
    if (await getRepository(PdfIndex).findOne(uuid))
        return pdfFilePath(uuid);
    else
        return null;
}