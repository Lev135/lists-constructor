import express from 'express'
import { Router } from 'express'
import * as listController from '../controllers/list-controller'

export const listRouter = Router();

listRouter.get('/create', express.static(__dirname + 'public/pages' + 'list/create.html'));
listRouter.post('/create', listController.create);

listRouter.get('/view', listController.viewPage);
listRouter.post('/compilePdf', listController.compile);
listRouter.get('/viewPdf', listController.viewPdf);