import { dco, Length, Numbering } from './tex-types';

export interface GlobalOptions {
    text : {
        mainTypeSize : dco.MainTypeSize;
    },
    page : {
        format : dco.PageSize,
        twoColumn : null | {
            columnSep : Length,
            columnSepRule : Length
        },
        pageNumbering : null | Numbering,
        margins : {
            left : Length,
            right : Length,
            top : Length,
            bottom : Length,
            bindingoffset : Length
        },
        orientation : 'landscape' | 'portrait'
    }
}