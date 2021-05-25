
export namespace dco {
    export type MainTypeSize = '10pt' | '11pt' | '12pt';
    export type PageSize = 'a4paper' | 'letterpaper' | 'a5paper' | 'b5paper' | 'executivepaper' | 'legalpaper';
    export type Draft = 'draft';
    export type Fleqn = 'fleqn';
    export type Leqno = 'leqno';
    export type TitlePage = 'titlepage' | 'notitlepage';
    export type ColumnsCount = 'onecolumn' | 'twocolumn';
    export type TwoSidesPrinting = 'twoside' | 'oneside';
    export type Landscape = 'landscape';
    export type OpenChapter = 'openright' | 'openany';
}


export type DocumentClassOption = 
    dco.MainTypeSize |
    dco.PageSize |
    dco.Draft | 
    dco.Fleqn |
    dco.Leqno |
    dco.TitlePage |
    dco.ColumnsCount |
    dco.TwoSidesPrinting |
    dco.Landscape |
    dco.OpenChapter;

export type PageStyle = 'plain' | 'headings' | 'empty';

export type LengthUnit = 'cm' | 'mm' | 'pt';

export type Length = [ number, LengthUnit ]

export function lengthToString(length : Length) {
    return length[0].toString() + length[1];
} 

export type MarginName = 'left' | 'right' | 'top' | 'bottom' | 'bindingoffset';

export type GeometryOption = [MarginName, Length]

export function optionToString<T extends string>(option : T) {
    if (typeof(option) === "string") {
        return option;
    }
    else {
        return option[0] + "=" + lengthToString(option[1]);
    }
}
export function optionsToString<T extends string>(options : T[]) {
    return options.map(option => optionToString(option)).join(',');
}

export type LengthVarName = 'columnsep' | 'columnseprule';

export interface LengthVar {
    name : LengthVarName;
    value : Length;
}

export type Numbering =   'arabic' 
                        | 'roman' | 'Roman' 
                        | 'alph' | 'Alph'; 
//                        | 'asbuk' | 'Asbuk'; // Doesn't work

export type PackageName = string
