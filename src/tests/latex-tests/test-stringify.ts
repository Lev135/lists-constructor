import { GeometryOption, Length, stringify } from "../../compilation/options/latex-language-types";

export function testStringify() {
    console.log(stringify({
        toTexString() : string {
            return "Hello!!!";
        }
    }), '\n')
    console.log(stringify(new Length(1, 'cm')), '\n');
//    const opt = new ValueOption("left", new Length(2, 'cm'));
//    console.log(stringify(opt));
}