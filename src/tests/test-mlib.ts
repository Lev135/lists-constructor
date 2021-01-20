import { keys } from "ts-transformer-keys";
import { pick } from "../mlib";

interface Tmp {
    n : number,
    s : string
}

function printKeys<T extends object>(obj : T) : void {
    console.log("keys<T> : ", keys<T>());
}

export function testMLib() {
    console.log("testing keys()");
    const arr = keys<Tmp>();
    console.log("arr :", arr);
    printKeys<Tmp>({n : 1, s : ""});
    
    const obj = {
        n : 1,
        s : "d",
        field : 3
    };
    console.log("testing pick()");
    const tmp1 : Tmp = obj;
    const tmp2 : Tmp = pick(obj, keys<Tmp>());
    console.log(tmp1, tmp2);
}