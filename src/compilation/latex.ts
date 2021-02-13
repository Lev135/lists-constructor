import { spawn } from 'child_process'

export async function compileTeX(inpFile : string, outpDir : string) : Promise<number> {
    const pdfMaker = spawn("pdflatex", [ `-output-directory=${outpDir}`, "-interaction=nonstopmode", inpFile ]);
    return new Promise((res, rej) => {
        pdfMaker.on('error', err => rej(err));
        pdfMaker.on('exit', code => res(code || 0))
    });
}
