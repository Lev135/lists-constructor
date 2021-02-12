import { GlobalOptions } from "./global-options";
import { stringify, stringifyArr, DocumentClassOption, GeometryOption, ValueOption, Length, LengthVar } from "./latex-language-types";

export const f = {
    stringify,
    stringifyArr,
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
            new ValueOption('left', margins.left),
            new ValueOption('top', margins.top),
            new ValueOption('right', margins.right),
            new ValueOption('bottom', margins.bottom),
            new ValueOption('bindingoffset', margins.bindingoffset)
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