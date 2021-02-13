// requires :
// Main framework:
import express from 'express';

// For dataBases
import * as MySql from 'mysql';

// For files
import * as FileStream from 'fs';

import { resolve } from 'path'

export const rootDir = resolve(__dirname + "\\..");

// Reading options user options

interface IPersonalOptions {
  dataBase: {
    name: string,
    user: string,
    password: string,
    host: string,
    port: number,
    logging?: LoggerOptions,
    logger?: "advanced-console" | "simple-console" | "file" | "debug",
    doNotClean?: boolean,
    doNotSync?: boolean
  },
  site : {
    port: number
  }
  debug?: {
    runTests?: boolean
  }
}

const optionsPath = './personal-options.json';

function readOptions() : IPersonalOptions {
  const optionsStr = FileStream.readFileSync(optionsPath, 'utf8').toString();  
  return optionsStr.split(/(?={")/).map(x => JSON.parse(x))[0];
}

function createOptionsFile() : void {
  const obj : IPersonalOptions = {
    dataBase : {
      name : "constructorDb",
      user : "root",
      password : "password",
      host : "localhost",
      port : 3306,
      logging: ["error", "warn", "info", "migration", "query", "schema"],
      logger: "simple-console",
      doNotClean : false,
      doNotSync : false
    },
    site : {
      port : 3000
    },
    debug: {
      runTests : false
    }
  }
  FileStream.writeFileSync(optionsPath, JSON.stringify(obj, null, 2));
}

import Getopt from 'node-getopt'

const getOpt = new Getopt([
  ['', 'sync'],
  ['', 'clean'],
  ['', 'test']
]).bindHelp();
const opt = getOpt.parse(process.argv.slice(2));
if (opt)
  console.log(opt);

console.log(1);
if (!FileStream.existsSync(optionsPath)) {
  console.log(2);
  createOptionsFile();
  console.log("Файл настроек 'personal-options.json' создан в корневой директории");
}
console.log("Считывание настроек...");
const options : IPersonalOptions = readOptions();
if (opt.options.sync) {
  options.dataBase.doNotSync = false;
}
if (opt.options.clean) {
  options.dataBase.doNotClean = false;
}
if (opt.options.test) {
  if (options.debug)
    options.debug.runTests = true;
  else
    options.debug = { runTests : true };
}
console.log(3);
main();

async function main() {
  try {
    const connection = await connectToDatabase();
    if (!options.dataBase.doNotClean) {
      try {
        await cleanDatabase(connection);
      }
      catch (err) {
        console.error("Ошибка при очистке базы данных: " + err.message);
        await closeConnection(connection);
        return;
      }
    }
    console.log(`Создание базы данных "${options.dataBase.name}"`);
    try {
      await createDatabaseIfNotExists(connection);
    }
    catch (err) {
      console.error("Ошибка при создании базы данных: " + err.message);
      await closeConnection(connection);
      return;
    }
    try {
      await startTypeOrm();
    }
    catch(err) {
      console.error("Ошибка при запуске TypeORM: " + err.message);
      await closeConnection(connection);
      return;
    }
    if (options.debug?.runTests) {
      try {
        await Test.run();
      }
      catch (err) {
        console.error("Ошибка во время тестирования: " + err.message);
        await closeConnection(connection);
        return;
      }
    }
    await closeConnection(connection);
    return;
  }
  catch (err) {
    console.error("Ошибка при подключении к базе данных: " + err.message);
    return;
  }
}


async function execQuery(connection: MySql.Connection, query: string) {
  return new Promise<void>((res, rej) => {
    connection.query(query, (err: MySql.MysqlError | null) => {
      if (err) {
        rej(err);
        return;
      }
      res();
    });
  });
}

async function connectToDatabase() {
  console.log("Подключение к базе данных MySql...");
  try {
    const connection = MySql.createConnection({
      host: options.dataBase.host,
      user: options.dataBase.user,
      port: options.dataBase.port,
      password: options.dataBase.password
    });
    console.log(`Подключение к базе данных прошло успешно`);
    return connection;
  }
  catch (err) {
    throw new Error(`Ошибка при подключении к базе данных: ${err.message}`);
  }
}

async function cleanDatabase(connection : MySql.Connection) {
  await execQuery(connection, `DROP DATABASE IF EXISTS ${options.dataBase.name};`);
}

async function createDatabaseIfNotExists(connection : MySql.Connection) {
  await execQuery(connection, `CREATE DATABASE IF NOT EXISTS ${options.dataBase.name};`);
}

async function closeConnection(connection : MySql.Connection) {
  await new Promise<void>((res, rej) => {
    connection.end((err?: MySql.MysqlError) => {
      if (err)
        rej(err);
      else
        res();
    });
  });
}


import * as TypeOrm from 'typeorm';
import * as Test from './tests/test';
import { User } from './entities/user';
import { Material } from './entities/material/material';
import { UserNote } from './entities/material/user-note';
import { Theme} from './entities/material/theme';
import { Task } from './entities/task/task';
import { TaskRemark } from './entities/task/task-remark';
import { TaskSolution } from './entities/task/task-solution';
import { List } from './entities/list/list';
import { ListBlock } from './entities/list/list-block';
import { ListBlockComment } from './entities/list/list-block-comment';
import { ListBlockTasks } from './entities/list/list-block-tasks';
import { ListBlockTaskItem } from './entities/list/list-block-task-item';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

async function startTypeOrm() {
  console.log("Подключение к БД через TypeORM...");
  try {
    const connection = await TypeOrm.createConnection({
      type: 'mysql',
      host: options.dataBase.host,
      port: options.dataBase.port,
      username: options.dataBase.user,
      password: options.dataBase.password,
      database: options.dataBase.name,
      logging: options.dataBase.logging,
      logger: options.dataBase.logger,
      synchronize: !options.dataBase.doNotSync,
      entities: [
        // "dist/entities/**/*{.ts,.js}",
        // "src/entities/**/*{.ts,.js}"
        User,
        Material, UserNote, Theme,
        Task, TaskRemark, TaskSolution,
        List, ListBlock, ListBlockComment, ListBlockTasks, ListBlockTaskItem,
        PdfIndex,
        LatexField, LatexPackage
      ]
    });
    console.log(`TypeORM успешно подключён к БД`);
    initTemplates().catch(err => console.log("ERROR with templates initialization", err));
    
    startExpress(connection);
  }
  catch (err) {
    console.error(`Ошика при подключении к БД через typeORM: `, err);
  }
}

import { userRouter } from './routes/user-router';
import { authorizeMiddleware } from './authorize-middleware';
import { taskRouter } from './routes/task-router';
import { listRouter } from './routes/list-router';
import { materialRouter } from './routes/material-router';
import { PdfIndex } from './entities/pdf-intex';
import { initTemplates } from './compilation/process-tamplates';
import { manageRouter } from './routes/manage-router';
import { LatexField } from './entities/latex/latex-field';
import { LatexPackage } from './entities/latex/latex-package';
import { latexRouter } from './routes/latex-router';

async function startExpress(connection : TypeOrm.Connection){
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
