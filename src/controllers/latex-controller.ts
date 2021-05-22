import { getPdfPath } from "../compilation";
import * as latexService from "../services/latex-service";
import * as types from '../types/latex-types'
import { ReqT, ResT } from "./mlib-controllers";

export async function latexPackages(req : ReqT<void, void>, res : ResT<types.GetPackagesSend>) {
    res.send(await latexService.getPackages());
}

export async function viewPdf(req : ReqT<types.GetViewPdfQuery, void>, res : any) {
    try {
        const path = await getPdfPath(req.query.uuid);
        if (path)
            res.sendFile(path);
        else
            res.send("Файл не найден");
    }
    catch (err) {
        console.log(err);
        res.send(`Ошибка при обработке запроса: ` + err.message);
    }
}
