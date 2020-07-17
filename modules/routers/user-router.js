const express = require('express');
module.exports = (Controllers) => {
  const userController = Controllers.UserController;
  const userRouter = express.Router();

  userRouter.get('/login', userController.loginPage);
  userRouter.post('/login', userController.login);

  userRouter.get('/register', userController.registrationPage);
  userRouter.post('/register', userController.register);

  userRouter.get('/logout', userController.logout);

  userRouter.get('/users', userController.usersPage);

  userRouter.get('/profile', userController.profilePage);

  return userRouter;
};
