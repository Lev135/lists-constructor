
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
