import express from 'express'
import { Router } from 'express'
import { initTemplates, updateTemplates } from '../compilation/process-tamplates';

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