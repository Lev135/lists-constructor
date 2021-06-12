import { Router } from 'express'

type Checker<QueryT, BodyT> = (
        query : QueryT, 
        body : BodyT, 
        userId : number
    ) => Promise<void> | void;

type Handler<QueryT, BodyT, SendT> = (
        query : QueryT, 
        body : BodyT,
        actorId : number
    ) => Promise<SendT> | SendT

type O<QueryT, BodyT, ResT> = {
    path : string, 
    checker ?: Checker<QueryT, BodyT>,
    handler : Handler<QueryT, BodyT, ResT>
}

async function tmp<QueryT, BodyT, SendT> (o : O<QueryT, BodyT, SendT>,
                                         req : any,
                                         res : any) {
    try {
        if (o.checker)
            await o.checker(req.query, req.body, req.user.id);
        try {
            const result = await o.handler(req.query, req.body, req.user.id);
            res.send(result);
        }
        catch (err) {
            console.log("Internal error: ", err);
            res.status(500).send(`Internal error: ${err}`);
        }
    }
    catch (err) {
        res.status(400).send(`Checking failed: ${err}`);
    }
}

export const MRouter = () => {
    const expressRouter = Router();

    function get<QueryT, BodyT, SendT>(o : O<QueryT, BodyT, SendT>) {
        expressRouter.get(o.path, (req, res) => tmp(o, req, res))
    }
    function put<QueryT, BodyT, SendT>(o : O<QueryT, BodyT, SendT>) {
        expressRouter.put(o.path, (req, res) => tmp(o, req, res))
    }
    function post<QueryT, BodyT, SendT>(o : O<QueryT, BodyT, SendT>) {
        expressRouter.post(o.path, (req, res, _) => tmp(o, req, res))
    }
    return {
        get, put, post,
        expressRouter
    }
}


export interface Uuid {
    uuid : string
}
