import { pick } from '../mlib';
import * as userService from '../services/user-service';
import jwt from 'jsonwebtoken';
import { keys } from 'ts-transformer-keys';
import * as t from '../types/user-types';
import { ReqT, ResT } from './mlib-controllers';

const SECRETKEY = 'SECRET_KEY'

export interface UserTokenInfo {
    id: number
};

export async function checkAuth(token: string): Promise<userService.UserGetMinModel | null> {
    if (!token) {
        return null;
    }
    if (token.includes('Bearer')) {
        token = token.slice(7);
    }
    try {
        if (jwt.verify(token, SECRETKEY)) {
            const obj = jwt.decode(token) as UserTokenInfo;
            return await userService.getUserMin(obj.id);
        }
    }
    catch (err) {
        console.log('invalid token');
    }
    return null;
}

function produceToken(user: UserTokenInfo): string {
    const info: UserTokenInfo = pick(user, keys<UserTokenInfo>());
    return jwt.sign(info, SECRETKEY);
}

export async function login(req : ReqT<void, t.PostLoginBody>, res : ResT<t.PostLoginSend>, _ : any) {
    try {
        const id : number = await userService.login(req.body.email, req.body.password);
        const token = produceToken( { id } );
        res.send({
            id, token
        });
    }
    catch (err) {
        console.log(err);
        res.send(err.message);
    }
}

export async function register (req : ReqT<void, t.PostRegisterBody>, res : ResT<t.PostRegisterSend>, _ : any) {
    try {
        const id = await userService.registerUser( req.body );
        const token = produceToken( { id } );
        res.send({
            id, token
        });
    }
    catch (err) {
        console.log(err);
        res.send(err.message);
    }
}
export async function profile(req : ReqT<t.GetProfileQuery, void>, res : ResT<t.GetProfilePost>)  {
    try {
        const profile = await userService.getUserProfile(req.query.id);
        res.send({ profile })
    }
    catch (err) {
        console.log(err);
        res.send("Ошибка при обработке запроса: " + err.message);
    }
}

export async function findUsers(req : any, res : any)  {
    throw new Error("Unrealized");
}