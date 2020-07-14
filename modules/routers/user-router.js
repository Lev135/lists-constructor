const express = require('express');
module.exports = (Controllers) => {
  console.log(Controllers);
  const userController = Controllers.UserController;
  const userRouter = express.Router();

  userRouter.post('/login', userController.login);
  userRouter.post('/register', userController.register);
  userRouter.get('/logout', userController.logout);
  userRouter.get('/register', userController.registrationPage);

  return userRouter;
};
