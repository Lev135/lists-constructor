const express = require('express');
module.exports = (Controllers) => {

  const testController = Controllers.TestController;
  const testRouter = express.Router();

  testRouter.get('/task/create', testController.createTaskPage);
  testRouter.post('/task/create', testController.createTask);
  testRouter.get('/task/view', testController.viewTaskPage);

  return testRouter;
};