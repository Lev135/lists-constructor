import express from 'express'

import { userRouter } from '../routes/user-router';
import { authorizeMiddleware } from '../authorize-middleware';
import { taskRouter } from '../routes/task-router';
import { listRouter } from '../routes/list-router';
import { materialRouter } from '../routes/material-router';
import { manageRouter } from '../routes/manage-router';
import { latexRouter } from '../routes/latex-router';
import { options } from '../processes/personal-options-process';

export async function startExpress(){
  const app = express();
  app.set("view engine", "pug");
  // json parser для передачи данных на север
  const bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  // директория для статический файлов
  app.use(express.static("public"));

  app.use(authorizeMiddleware);

  /*
  // Перенаправление невошедших на user/login
  app.use((req, res, next) => {
    if (req.url == '/user/login' || req.url == '/user/register' || req.isAuthenticated()) {
      next();
    } else {
      console.log("Нашли зайца!)");
      res.redirect('/user/login');
    }
  });
*/
  app.use('/user', userRouter);
  app.use('/task', taskRouter);
  app.use('/list', listRouter);
  app.use('/material', materialRouter);
  app.use('/manage', manageRouter);
  app.use('/latex', latexRouter);
  
  // обработка ошибки 404
  app.use(function (req, res, next) {
      res.status(404).send("Not Found");
  });

  app.listen(options.site.port);
  console.log("Сервер запущен!")
}
