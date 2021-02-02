import { pick } from '../mlib';
import * as userService from '../services/user-service';
import jwt from 'jsonwebtoken';
import { keys } from 'ts-transformer-keys';
import * as types from '../types/user-types';

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
            return userService.getUserMin(obj.id);
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

export async function loginPage(req : any, res : any) {
    res.render("user/login.pug");
}
export async function login(req : any, res : any, _next : any) {
    try {
        const body : types.PostLogin = req.body;
        const id : number = await userService.login(body.email, body.password);
        const token = produceToken( { id } );
        const obj : types.SendPostLogin = {
            id, token
        }
        res.send(obj);
    }
    catch (err) {
        console.log(err);
        res.send(err.message);
    }
}

export async function registrationPage(req : any, res : any) {
    res.render("user/register.pug");
}
export async function register (req : any, res : any, next : any) {
    try {
        const body : types.PostRegister = req.body;
        const id = await userService.registerUser( body );
        const token = produceToken( { id } );
        const obj : types.SendPostRegister = {
            id, token
        }
        res.send( obj );
    }
    catch (err) {
        console.log(err);
        res.send(err.message);
    }
}
export async function logout (req : any, res : any) {
    res.send("Unrealized");
}
export async function usersPage(req : any, res : any) {
    res.send("Unrealized");
}
export async function profilePage(req : any, res : any)  {
    try {
        const query : types.GetProfilePage = req.query;
        const profile = await userService.getUserProfile(query.id);
        const obj : types.RenderProfilePage = { profile }
        if (req.query.id == req.user.id) {
            res.render('user/my-profile.pug', obj);
        }
        else {
            res.render('user/profile.pug', obj);
        }
    }
    catch (err) {
        console.log(err);
        res.send("Ошибка при обработке запроса: " + err.message);
    }
}

export async function findUsers(req : any, res : any)  {
    throw new Error("Unrealized");
}