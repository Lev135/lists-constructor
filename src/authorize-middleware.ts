import { checkAuth } from "./controllers/user-controller";

export async function authorizeMiddleware(req : any, res : any, next : any) {
    const token = req.headers['authorization'];
    if (token) {
        const user = await checkAuth(token);
        if (user) {
            req.user = user;
        }
    }
    return next();
}