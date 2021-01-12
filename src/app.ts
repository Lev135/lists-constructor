// requires :
// Main framework:
import express from 'express';

// For dataBases
import * as MySql from 'mysql';

// For files
import * as FileStream from 'fs';

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
    doNotClean?: boolean
  },
  site : {
    port: number
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
      doNotClean : false
    },
    site : {
      port : 3000
    }
  }
  FileStream.writeFileSync(optionsPath, JSON.stringify(obj, null, 2));
}

console.log(1);
if (!FileStream.existsSync(optionsPath)) {
  console.log(2);
  createOptionsFile();
  console.log("Файл настроек 'personal-options.json' создан в корневой директории");
}
console.log("Считывание настроек...");
const options : IPersonalOptions = readOptions();
console.log(3);
main();

async function main() {
  if (options.dataBase.doNotClean) {
    await startTypeOrm();
  }
  else if (await cleanDataBase()) {
    await startTypeOrm();
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

// Creating dataBase if not exists
async function cleanDataBase(): Promise<boolean> {
  console.log("Подключение к базе данных MySql...");
  try {
    const connection = MySql.createConnection({
      host: options.dataBase.host,
      user: options.dataBase.user,
      port: options.dataBase.port,
      password: options.dataBase.password
    });
    console.log(`Подключение к базе данных прошло успешно`);

    
    try {
      await execQuery(connection, `DROP DATABASE IF EXISTS ${options.dataBase.name};`);
      await execQuery(connection, `CREATE DATABASE IF NOT EXISTS ${options.dataBase.name};`);
      return true;
    }
    catch (err) {
      console.error(`Ошибка при отчистке базы данных: ${err.message}`);
    }
    finally {
      await closeConnection(connection);
    }
  }
  catch (err) {
    console.log(`Ошибка при подключении к базе данных: ${err.message}`);
  }
  return false;
}

async function closeConnection(connection : MySql.Connection) {
  try {
    await new Promise<void>((res, rej) => {
      connection.end((err?: MySql.MysqlError) => {
        if (err)
          rej(err);
        else
          res();
      });
    });
    console.log("Подключение к серверу MySql успешно закрыто");
  }
  catch (err) {
    console.log("Ошибка при закрытии подключении к серверу MySql: " + err.message);
  };
}


import * as TypeOrm from 'typeorm';
import * as Test from './test';
import { User } from './entities/user';
import { Material } from './entities/material/material';
import { Task } from './entities/task/task';
import { TaskNote } from './entities/task/task-note';
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
      synchronize: true,
      entities: [
        // "dist/entities/**/*{.ts,.js}",
        // "src/entities/**/*{.ts,.js}"
        User,
        Material,
        Task, TaskNote, TaskSolution,
        List, ListBlock, ListBlockComment, ListBlockTasks, ListBlockTaskItem
      ]
    });
    console.log(`TypeORM успешно подключён к БД`);
    Test.run();
    startExpress(connection);
  }
 catch (err) {
  console.error(`Ошика при подключении к БД через typeORM: `, err);
 }
}

import passport from 'passport';
import localStrategy from 'passport-local';

async function startExpress(connection : TypeOrm.Connection){
  const app = express();
  app.set("view engine", "pug");
  // json parser для передачи данных на север
  const bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  // директория для статический файлов
  app.use(express.static("public"));

  startPassport(connection);

  const cookieParser = require('cookie-parser');
  app.use(cookieParser());
  const session = require('express-session');
  app.use(session({
    secret: 'SECRET',
    resave: true,
    saveUninitialized: true,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Перенаправление невошедших на user/login
  app.use((req, res, next) => {
    if (req.url == '/user/login' || req.url == '/user/register' || req.isAuthenticated()) {
      next();
    } else {
      console.log("Нашли зайца!)");
      res.redirect('/user/login');
    }
  });

  
  // обработка ошибки 404
  app.use(function (req, res, next) {
      res.status(404).send("Not Found");
  });

  app.listen(options.site.port);
  console.log("Сервер запущен!")
}

async function startPassport(connection : TypeOrm.Connection) { 
  const userRep = connection.getRepository(User);

  const myStrategy : localStrategy.Strategy = new localStrategy.Strategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    async function(email : string, password : string, 
            done : (error: any, user?: any, options?: localStrategy.IVerifyOptions) => void) {
      try {
        const user : User | undefined = await userRep.findOne({email}) ;
        if (!user) {
          return done(null, false, {message: "Пользователь с такой почтой не найден"});
        }
        else if (user.password != password) {
          return done(null, false, {message: "Неверный пароль"});
        }
        else {
          return done(null, user);
        }
      }
      catch (err) {
        console.error("Ошибка во время авторизации: " + err);
      }
    }
  );
  passport.serializeUser(function(user : any, done) {
    done(null, user.id);
  });
  passport.deserializeUser(async function(id, done) {
    try {
      const user : User = (await userRep.findByIds([id]))[0];
      done(null, user);
    }
    catch (err) {
      console.error("Ошибка во время авторизации: " + err);
    }
  });

}