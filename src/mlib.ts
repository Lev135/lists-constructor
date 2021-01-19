export function pick<T1 extends T2, T2, KT extends keyof T2> (obj : T1, keys : KT[]) : T2 {
    let res : any = {};
    keys.forEach(key => {
        res[key] = obj[key];
    });
    return res;
}

export function sortByField<T1, T2 extends keyof T1>(arr : T1[], key : T2) {
    return arr.sort((a, b) => {
        if (a[key] < b[key])
            return -1;
        else if (a[key] == b[key])
            return 0;
        else
            return 1;
    });
}
