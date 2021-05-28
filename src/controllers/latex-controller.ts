import { getPdfPath } from "../compilation/latex-compilation";
import * as latexService from "../services/latex-service";
import * as types from '../types/latex-types'
import { ReqT, ResT } from "../mlib";

export async function latexPackages(req : ReqT<void, void>, res : ResT<types.GetPackagesSend>) {
    res.send(await latexService.getPackages());
}

export async function viewPdf(req : ReqT<types.GetViewPdfQuery, void>, res : any) {
    try {
        const info = await getPdfPath(req.query.uuid);
        if (info.processed) {
            if (info.pdfString)
                res.sendFile(info.pdfString);
            else
                res.send(`Компиляция завершилась с кодом ${info.exitCode}`);
        }
        else {
            res.send("Файл ещё компилируется");
        }
    }
    catch (err) {
        console.log(err);
        res.send(`Ошибка при обработке запроса: ` + err.message);
    }
}
