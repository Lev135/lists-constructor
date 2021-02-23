import dot from 'dot';
import { readFile, readdir, writeFile } from 'fs/promises';
import { getRepository } from 'typeorm';
import { rootDir } from '../app';
import { PdfIndex } from '../entities/pdf-intex';
import { f } from './options/functions';

dot.setDelimiters({
    start : '<!',
    end : '!>'
});

const templateDir = rootDir + "\\latex-templates";

interface TemplatesInterface {
    [key : string] : {
        fileHash : string
        func : dot.TemplateFunction
    }
}

let templates : TemplatesInterface = {};

function hashFile(file : string) : Promise<string> {
    return new Promise((res : (hash : string) => void, rej : (err : any) => void) => {
        require('hash-files')( {files : file}, 
            (err : any, hash : string) => err ? rej(err) : res(hash)
        );
    });
}

const templatePath = (fileName : string) => `${templateDir}\\${fileName}`;

// import {js_beautify} from 'js-beautify'

async function updateTemplateFunction(templateName : string, filePath : string) : Promise<void> {
    const file = (await readFile(filePath)).toString();
    const func = dot.template(file, { argName : ['obj', 'pars', 'f'], strip : false });
    // console.log(js_beautify(func.toString()));
    templates[templateName] = {
        fileHash : await hashFile(filePath),
        func
    }
}

async function updateTemplateIfNecessary(templateName : string, filePath : string) {
    if (templates[templateName] && templates[templateName].fileHash == await hashFile(filePath))
        return;
    Promise.all([
        updateTemplateFunction(templateName, filePath),
        getRepository(PdfIndex).delete({
            'templateName' : templateName
        })
    ]);
}

export async function updateTemplates(anyway : boolean = false) : Promise<void> {
    const filenames : string[] = await readdir(templateDir);

    const promises = [];
    for (const filename of filenames) {
        const extension = filename.split('.').pop();
        const templateName = filename.slice(0,  extension ? -(extension.length + 1) : undefined);
        if (!templateName) // skipping folders
            continue;
        if (anyway)
            promises.push(updateTemplateFunction(templateName, templatePath(filename)));
        else
            promises.push(updateTemplateIfNecessary(templateName, templatePath(filename)));
    }
    await Promise.all(promises);
} 

export async function initTemplates() : Promise<void> { 
    await getRepository(PdfIndex).delete({ /* all */ });
    await updateTemplates(true);
}


export function generateTeX(texFilePath : string, 
                            templateName : string, 
                            templatePars : any, 
                            obj : any) : Promise<void> {
    return writeFile(texFilePath, templates[templateName].func({ obj, pars : templatePars, f }));
}
