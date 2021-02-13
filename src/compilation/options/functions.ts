import { GlobalOptions } from "./global-options";
import { DocumentClassOption, GeometryOption, Length, lengthToString, LengthVar, optionsToString } from "./latex-language-types";


export const f = {
    lengthToString,
    optionsToString,

    documentClassOptions(pars : GlobalOptions) : DocumentClassOption[] {
        const options : DocumentClassOption[] = [];
        options.push(pars.text.mainTypeSize);
        options.push(pars.page.format);
        if (pars.page.orientation == 'landscape') {
            options.push('landscape')
        }
        if (pars.page.twoColumn) {
            options.push('twocolumn');
        }
        return options;
    },
    geometryOptions(pars : GlobalOptions) : GeometryOption[] {
        const margins = pars.page.margins;
        const options : GeometryOption[] = [
            ['left', margins.left],
            ['top', margins.top],
            ['right', margins.right],
            ['bottom', margins.bottom],
            ['bindingoffset', margins.bindingoffset]
        ];
        return options;
    },
    lengthVars(pars : GlobalOptions) : LengthVar[] {
        const res : LengthVar[] = [];
        const twoColumn = pars.page.twoColumn;
        if (twoColumn) {
            res.push({
                name : "columnsep",
                value : twoColumn.columnSep
            }, {
                name : "columnseprule",
                value : twoColumn.columnSepRule
            })
        }
        return res;
    }
}