import { createQueryBuilder, getRepository } from 'typeorm';
import { PdfIndex } from '../entities/latex/pdf-index';
import { mkdir } from 'fs/promises';
import { Material } from '../entities/material/material';
import { rootDir } from '../app';
import { generateTeX } from './latex-templates';
import { compileTeX } from './latex'
import { exit } from 'process';

export const pdfDir = rootDir + "\\pdf";
export const templateDir = rootDir + "\\latex-templates";

const pdfFolder = (recordUuid : string) => `${pdfDir}\\${recordUuid}`;
const texFilePath = (recordUuid : string) => `${pdfFolder(recordUuid)}\\${recordUuid}.tex`
const pdfFilePath = (recordUuid : string) => `${pdfFolder(recordUuid)}\\${recordUuid}.pdf`;

async function doWork(uuid : string,
                      templateName : string,
                      templatePars : any,
                      obj : any) {
    try {
        await mkdir(pdfFolder(uuid), { recursive : true });
        await generateTeX(texFilePath(uuid), templateName, templatePars, obj);
        const exitCode = await compileTeX(texFilePath(uuid), pdfFolder(uuid));
        await getRepository(PdfIndex).update(uuid, {
            processed : true, exitCode
        });
    }
    catch (ex) {
        console.error("ERROR in async function ", ex);
        exit(-1);
    }
}

async function compilePdfImpl(compilableUuid : string,
                             templateName : string,
                             templatePars : any,
                             obj : any) : Promise<string> {
    const templateParsJSON : string = JSON.stringify(templatePars);
    const newRecord : PdfIndex = await getRepository(PdfIndex).save({
        compilableUuid,
        templateName,
        templateParsJSON
    });
    // Только запускаем обработку. await нет специально
    doWork(newRecord.uuid ,templateName, templatePars, obj);
    return newRecord.uuid;
}

export async function compilePdf(compilableUuid : string,
                                templateName : string,
                                templatePars : any,
                                obj : any) : Promise<string> {
    const templateParsJSON : string = JSON.stringify(templatePars);
    return getRepository(PdfIndex).findOne({ compilableUuid, templateName, templateParsJSON })
        .then(index => index 
                    ? index.uuid
                    : compilePdfImpl(compilableUuid, templateName, templatePars, obj));
}


export interface PdfInfo {
    uuid : string;
    processed : boolean;
    exitCode ?: number;
    pdfString ?: string;
}

export async function getPdfPath(uuid : string) : Promise<PdfInfo> {
    const record = await getRepository(PdfIndex).findOneOrFail(uuid);
    if (record.processed) {
        return {
            uuid,
            processed : true,
            exitCode : record.exitCode,
            pdfString : record.exitCode === 0 ? pdfFilePath(uuid) : undefined
        }
    }
    else {
        return {
            uuid,
            processed : false
        }
    }
}
