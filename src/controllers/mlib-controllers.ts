
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
