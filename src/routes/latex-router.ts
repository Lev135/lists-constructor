import { Router } from 'express'
import * as latexController from '../controllers/latex-controller'

export const latexRouter = Router();

latexRouter.get('/packages', latexController.latexPackages)
