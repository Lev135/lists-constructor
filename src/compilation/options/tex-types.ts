import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

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

interface Stringable {
    toTexString() : string;
}

export class Length implements Stringable {
    val : number;
    unit : LengthUnit;
    constructor (_val : number, _unit : LengthUnit) {
        this.val = _val;
        this.unit = _unit;
    }
    toTexString() : string {
        return this.val.toString() + this.unit;
    }
}

export function stringify<Type extends Stringable>(obj : Type | string) : string {
    return typeof obj === "string" ? obj : obj.toTexString();
}

export function stringifyArr<Type extends Stringable | string>(arr : Type[]) : string {
    return arr.map(el => stringify(el)).join(',');
}

export class ValueOption<Name extends string, Type extends Stringable | string> implements Stringable {
    name : Name;
    value : Type;
    constructor (_name : Name, _val : Type) {
        this.name = _name;
        this.value = _val;
    }
    toTexString() : string {
        return this.name + "=" + stringify(this.value);
    }
}

export type MarginName = 'left' | 'right' | 'top' | 'bottom' | 'bindingoffset';

export type GeometryOption = ValueOption<MarginName, Length>;

export type LengthVarName = 'columnsep' | 'columnseprule';

export interface LengthVar {
    name : LengthVarName;
    value : Length;
}

export type Numbering = 'arabic' | 'roman' | 'Roman' | 'alph' | 'Alph' | 'asbuk' | 'Asbuk';
