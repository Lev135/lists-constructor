import express from 'express'
import { Router } from 'express'
import * as materialController from '../controllers/material-controller';

export const materialRouter : Router = Router();

materialRouter.get('/userNote', materialController.getUserNote);
materialRouter.post('/userNote', materialController.setUserNote);