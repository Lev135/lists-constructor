import { Router } from 'express'
import { initTemplates, updateTemplates } from '../compilation/latex-templates';

export const manageRouter = Router();

manageRouter.get('/it', async (req : any, res : any) => {
    try {
        await initTemplates();
        res.send("Templates intialized");
    }
    catch (err) {
        res.send(err);
    }
});
manageRouter.get('/ut', async (req : any, res : any) => {
    try {
        await updateTemplates(req.query && req.query.anyway);
        res.send("Templates updated");
    }
    catch (err) {
        res.send(err);
    }
})
manageRouter.get('/user', async (req : any, res : any) => {
    res.send(req.user);
})