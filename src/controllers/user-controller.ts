import passport from 'passport';
import { pick } from '../mlib';
import * as userService from '../services/user-service'
import { UserPassportInterface } from '../app'

export async function loginPage(req : any, res : any) {
    res.render("user/login.pug");
}
export async function login(req : any, res : any, next : any) {
    passport.authenticate('local', (err, user : UserPassportInterface, info) => {
        if (err)
            return next(err);
        if (!user)
            return res.redirect('/');
        return req.login(user, (err : any) => ( err ? next(err) : res.redirect(`./profile?id=${user.id}`)));
    })(req, res, next);
}

export async function registrationPage(req : any, res : any) {
    res.render("user/register.pug");
}
export async function register (req : any, res : any, next : any) {
    if (!req.body) {
      return res.sendStatus(400);
    }
    try {
        console.log(req.body);
        const id = await userService.registerUser(req.body);
        console.log(id);
        req.logIn(pick(req.body, ['email', 'password']), (err : any) => {
            return err ? next(err) : res.redirect(`./profile?id=${id}`);
        });
    }
    catch (err) {
        res.send("Ошибка при обработке запроса: " + err.message);
    }
}
export async function logout (req : any, res : any) {
    req.logout();
    res.redirect('/');
}
export async function usersPage(req : any, res : any) {
    throw new Error("Unrealized")
}
export async function profilePage(req : any, res : any)  {
    try {
        const profile = await userService.getUserProfile(req.query.id);
        if (req.query.id == req.user.id) {
            res.render('user/my-profile.pug', { profile});
        }
        else {
            res.render('user/profile.pug', { profile });
        }
    }
    catch (err) {
        req.send("Ошибка при обработке запроса: " + err.message);
    }
}

export async function findUsers(req : any, res : any)  {
    throw new Error("Unrealized");
}