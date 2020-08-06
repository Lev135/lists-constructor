const express = require('express');
module.exports = (Controllers) => {
  const tagController = Controllers.TagController;
  const tagRouter = express.Router();

  tagRouter.post('/tag-tree', tagController.getTagTree);

  
  return tagRouter;
};
