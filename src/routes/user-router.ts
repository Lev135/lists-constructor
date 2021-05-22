import { Router } from 'express'
import * as userController from '../controllers/user-controller'
import { GetFT, PostFT } from './mlib-routers';

export const userRouter : Router = Router();

//userRouter.get('/login', userController.loginPage);
userRouter.post('/login', userController.login as PostFT);

//userRouter.get('/register', userController.registrationPage);
userRouter.post('/register', userController.register as PostFT);

//userRouter.get('/logout', userController.logout);

//userRouter.get('/users', userController.usersPage);
userRouter.get('/profile', userController.profile as GetFT);
