import express from 'express'
import { Router } from 'express'
import * as materialController from '../controllers/material-controller';
import { GetFT, PostFT } from './mlib-routers';

export const materialRouter : Router = Router();

materialRouter.get('/userNote', materialController.getUserNote as GetFT);
materialRouter.post('/userNote', materialController.setUserNote as PostFT);

materialRouter.get('/accessRules', materialController.getAccessRules as GetFT);
materialRouter.put('/accessRules', materialController.setAccessRule as GetFT);
