import { spawn } from 'child_process'
import { rootDir } from './app';

async function compileTeX(inpFile : string, outpDir : string) : Promise<number> {
    const pdfMaker = spawn("pdflatex", [ `-output-directory=${outpDir}`, "-interaction=nonstopmode", inpFile ]);
    return new Promise((res, rej) => {
        pdfMaker.on('error', err => rej(err));
        pdfMaker.on('exit', code => res(code || 0))
    });
}

export const pdfDir = rootDir + "\\pdf";
export const templateDir = rootDir + "\\latex-templates";

import Mustache, { render } from 'mustache';
import { createQueryBuilder, getRepository } from 'typeorm';
import { PdfIndex } from './entities/pdf-intex';
import { mkdir, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { Material } from './entities/material/material';

Mustache.tags = ['<!', '!>'];

const pdfFolder = (recordId : string) => `${pdfDir}\\${recordId}`;
const texFilePath = (recordId : string) => `${pdfFolder(recordId)}\\${recordId}.tex`
const pdfFilePath = (recordId : string) => `${pdfFolder(recordId)}\\${recordId}.pdf`;
const templateFilePath = (templateName : string) => `${templateDir}\\${templateName}.tex`;

async function generateTeX(id : string, templateName : string, templatePars : any, obj : any) : Promise<void> {
    writeFileSync(texFilePath(id),
        render(readFileSync(templateFilePath(templateName)).toString(), {
            obj : obj,
            pars : templatePars
        })
    );
}

async function createPdfFile(compilableId : number,
                             templateName : string,
                             templatePars : any,
                             obj : any) {
    const templateParsJSON : string = JSON.stringify(templatePars);
    const newRecord : PdfIndex = await getRepository(PdfIndex).save({
        compilable : await getRepository(Material).findOneOrFail(compilableId),
        templateName,
        templateParsJSON
    });

    mkdirSync(pdfFolder(newRecord.id), { recursive : true });
    await generateTeX(newRecord.id, templateName, templatePars, obj);
    const exitCode = await compileTeX(texFilePath(newRecord.id), pdfFolder(newRecord.id));
    if (exitCode != 0) {
        throw new Error(`Компиляция завершилась с кодом ${exitCode}`);
    }
    return pdfFilePath(newRecord.id);
}

export async function getPdfPath(compilableId : number,
                                 templateName : string,
                                 templatePars : any,
                                 obj : any) {
    const templateParsJSON : string = JSON.stringify(templatePars);
    const record : PdfIndex | undefined = await createQueryBuilder(PdfIndex, 'pdf_index')
        .where('pdf_index.compilableId = :compilableId', { compilableId })
        .andWhere('pdf_index.templateName = :templateName', { templateName })
        .andWhere('pdf_index.templateParsJSON = :templateParsJSON', { templateParsJSON })
        .getOne(); 
    if (record) {
        return pdfFilePath(record.id); 
    }
    else {
        return createPdfFile(compilableId, templateName, templatePars, obj);
    }
}