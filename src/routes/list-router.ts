import { Router } from 'express'
import * as listController from '../controllers/list-controller'
import { GetFT, PostFT } from '../mlib';

export const listRouter = Router();

listRouter.post('/create', listController.create as PostFT);

listRouter.get('/view', listController.view as GetFT);

listRouter.put('/edit', listController.edit as GetFT);

listRouter.post('/compilePdf', listController.compile as PostFT);
