import express from 'express'
import { Router } from 'express'
import * as taskController from '../controllers/task-controller'

export const taskRouter : Router = Router();

taskRouter.get('/create', express.static(__dirname + '/public/pages' + '/task/create.html'));
taskRouter.post('/create', taskController.create);

taskRouter.get('/view', taskController.viewPage);
taskRouter.get('/viewPdf', taskController.viewPdf);