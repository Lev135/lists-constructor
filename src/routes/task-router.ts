import { Router } from 'express'
import * as taskController from '../controllers/task-controller'
import { GetFT, PostFT } from './mlib-routers';

export const taskRouter : Router = Router();

//taskRouter.get('/create', express.static(__dirname + '/public/pages' + '/task/create.html'));
taskRouter.post('/create', taskController.create as PostFT);

taskRouter.get('/view', taskController.viewPage as GetFT);
