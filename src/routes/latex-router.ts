import { Router } from 'express'
import * as latexController from '../controllers/latex-controller'
import { GetFT } from '../mlib';

export const latexRouter = Router();

latexRouter.get('/packages', latexController.latexPackages as GetFT);
latexRouter.get('/viewPdf', latexController.viewPdf);
