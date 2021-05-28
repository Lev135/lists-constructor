export function pick<T2 extends object, T1 extends T2> (obj : T1, keysArr : Array<keyof T2>) : T2 {
    let res : any = {};
    keysArr.forEach(key => {
        res[key] = obj[key];
    });
    return res;
}

export function sortByField<T1, T2 extends keyof T1>(arr : T1[], key : T2) : void {
    arr.sort((a, b) => {
        if (a[key] < b[key])
            return -1;
        else if (a[key] == b[key])
            return 0;
        else
            return 1;
    });
}

export function keysForSelection<T>(name : string, keys : Array<keyof T>) : Array<string> {
    return keys.map(key => name + '.' + key);
}

export type PostFT = (req : any, res : any, next : any) => void;
export type GetFT = (req : any, res : any) => void;

export type ErrorT = string;

export interface ReqT<QueryT, BodyT> {
    query : QueryT,
    body : BodyT,
    user : {
        id : number
    }
};

export interface ResT<SendT> {
    send : (data: SendT | ErrorT) => void
};

export function processError(err : any, res : { send : (msg : ErrorT) => void }) {
    console.log(err);
    res.send("Ошибка при обработке запроса: " + err.message);
} 
