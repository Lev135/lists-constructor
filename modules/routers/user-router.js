const express = require('express');
module.exports = (Controllers) => {
  console.log(Controllers);
  const userController = Controllers.UserController;
  const userRouter = express.Router();

  userRouter.use('/registration', userController.registrationPage);
  userRouter.use('/registrationPost', userController.registrationPost);
  userRouter.use('/profile', userController.profilePage);
  userRouter.use('/users', userController.usersPage);

  return userRouter;
};
