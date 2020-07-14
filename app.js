const express = require('express');

const MySql = require('mysql2/promise');
const Sequelize = require('sequelize');

const FileStream = require('fs');
const options = FileStream.readFileSync('./personal-options.json', 'utf8')
      .toString().split(/(?={")/).map(x => JSON.parse(x))[0];
console.log(options);

/*
  Создаём базу данных. Можно ли это сделать как-то проще,
  без отдельного подключения MySQL?
*/
MySql.createConnection({
  host: options.dataBase.host,
  user: options.dataBase.user,
  port: options.dataBase.port,
  password: options.dataBase.password
}).then(connection => {
  console.log("Соединение с сервером MySql успешно установлено");
  connection.query(`DROP DATABASE IF EXISTS ${options.dataBase.name}`).then(res => {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${options.dataBase.name};`).then(res => {
      console.log("База данных создана/успешно проверена");
      closeConnection(connection);
      startSequelize();
    }).catch(err => {
      closeConnection(connection);
      console.error("Ошибка при создании/проверке базы данных: " + err.message);
    });
  });
}).catch(err => {
  console.error("Ошибка при подключении к серверу MySql: " + err.message);
});

function closeConnection(connection) {
  connection.end().then(()=> {
    console.log("Подключение к серверу MySql успешно закрыто");
  }).catch(err => {
    console.log("Ошибка при закрытии подключении к серверу MySql: " + err.message);
  });
}

/*
  Основная часть запуска. Вынесена в функцию, чтобы запускалась после создания БД.
  Опять же, выглядит кривовато, можно ли это как-то поправить?
*/

function startSequelize() {
  const sequelize = new Sequelize(options.dataBase.name, options.dataBase.user, options.dataBase.password, {
    dialect: "mysql",
    host: options.dataBase.host,
    port: options.dataBase.port
  });
  console.log("Подключение моделей...");
//  try {
  const Models = require('./modules/sequelize-models/sequelize-models')
                                                      (sequelize, Sequelize);
//  } catch (err) {
//    console.log("Ошибка при подключении моделей sequelize: " + err.message);
//    throw err;
//  }
  console.log("Подключение User успешно завершено");

  sequelize.sync({force:true}).then(result => {
    console.log("Sequelize успешно синхронизован");
    try {
      startExpress(sequelize, Models);
    }
    catch (err) {
      console.error("Ошибка при запуске Express: " + err);
    }
  }).catch(err => {
    console.log("Ошибка при синхронизации sequelize" + err);
    sequelize.close();
  });
}

function startExpress(sequelize, Models) {
  const app = express();
  app.set("view engine", "pug");
  const bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({ extended: false }));

  const Controllers = require('./modules/controllers/controllers')(Models);
  const Routers = require('./modules/routers/routers')(Controllers);
  app.use('/user', Routers.UserRouter);

  // обработка ошибки 404
  app.use(function (req, res, next) {
      res.status(404).send("Not Found");
  });

  app.listen(options.site.port);
}
