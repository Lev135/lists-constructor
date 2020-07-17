const express = require('express');
module.exports = (Controllers) => {
  const taskController = Controllers.TaskController;
  const taskRouter = express.Router();

  taskRouter.get('/view', taskController.viewPage);

  taskRouter.get('/create', taskController.createPage);
  taskRouter.post('/create', taskController.create);

   taskRouter.get('/edit', taskController.editPage);
   taskRouter.post('/edit', taskController.edit);

  return taskRouter;
};
